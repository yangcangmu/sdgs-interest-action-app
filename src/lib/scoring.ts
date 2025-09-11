import { Question, Response, ScoreSnapshot, QuizSubmission, QuizResult, ActionRecommendation } from '@/types';

/**
 * SDGsスコアリングロジック
 * 仕様書通りの計算式を実装
 */

export class ScoringEngine {
  private questions: Question[];
  private responses: Response[];

  constructor(questions: Question[], responses: Response[]) {
    this.questions = questions;
    this.responses = responses;
  }

  /**
   * 回答された質問のIDセットを取得
   */
  private getAnsweredQuestionIds(): Set<string> {
    return new Set(this.responses.map(r => r.questionId));
  }

  /**
   * 特定の質問の回答を取得
   */
  private getResponseForQuestion(questionId: string): Response | undefined {
    return this.responses.find(r => r.questionId === questionId);
  }

  /**
   * 特定の質問の全選択肢のSDGタグの和集合を取得
   */
  private getAllSdgTagsForQuestion(questionId: string): Set<number> {
    const question = this.questions.find(q => q.id === questionId);
    if (!question) return new Set();

    const allTags = new Set<number>();
    question.options.forEach(option => {
      option.sdgTags.forEach(tag => allTags.add(tag));
    });
    return allTags;
  }

  /**
   * 選択された選択肢のSDGタグを取得
   */
  private getSelectedSdgTags(questionId: string): Set<number> {
    const response = this.getResponseForQuestion(questionId);
    if (!response) return new Set();

    const question = this.questions.find(q => q.id === questionId);
    if (!question) return new Set();

    const selectedOption = question.options.find(o => o.id === response.optionId);
    if (!selectedOption) return new Set();

    return new Set(selectedOption.sdgTags);
  }

  /**
   * Raw SDGスコアを計算
   * raw[s] = Σ(1{s ∈ Tags(q, chosen)} * I_q)
   */
  private calculateRawScores(): Record<number, number> {
    const rawScores: Record<number, number> = {};
    
    // 1-17のSDGを初期化
    for (let i = 1; i <= 17; i++) {
      rawScores[i] = 0;
    }

    this.responses.forEach(response => {
      const selectedTags = this.getSelectedSdgTags(response.questionId);
      selectedTags.forEach(sdg => {
        rawScores[sdg] += response.intensity;
      });
    });

    console.log('=== Rawスコア計算 ===');
    for (let i = 1; i <= 17; i++) {
      if (rawScores[i] > 0) {
        console.log(`SDG ${i}: raw=${rawScores[i]}`);
      }
    }

    return rawScores;
  }

  /**
   * Exposure SDGスコアを計算
   * exp[s] = Σ(3 * 1{s ∈ AllTags(q)})
   */
  private calculateExposureScores(): Record<number, number> {
    const expScores: Record<number, number> = {};
    
    // 1-17のSDGを初期化
    for (let i = 1; i <= 17; i++) {
      expScores[i] = 0;
    }

    // 回答された質問のSDGタグを集計
    const answeredQuestionIds = this.getAnsweredQuestionIds();
    answeredQuestionIds.forEach(questionId => {
      const allTags = this.getAllSdgTagsForQuestion(questionId);
      allTags.forEach(sdg => {
        expScores[sdg] += 3; // 最大スライダー値 = 3
      });
    });

    console.log('=== Exposureスコア計算 ===');
    for (let i = 1; i <= 17; i++) {
      if (expScores[i] > 0) {
        console.log(`SDG ${i}: exp=${expScores[i]}`);
      }
    }

    return expScores;
  }

  /**
   * 正規化SDGスコアを計算 (0-100)
   * norm[s] = floor(100 * raw[s] / exp[s] + 0.5) if exp[s] > 0, else 0
   */
  private calculateNormalizedScores(): Record<number, number> {
    const rawScores = this.calculateRawScores();
    const expScores = this.calculateExposureScores();
    const normScores: Record<number, number> = {};

    console.log('=== 正規化スコア計算 ===');
    for (let i = 1; i <= 17; i++) {
      if (expScores[i] > 0) {
        const ratio = rawScores[i] / expScores[i];
        normScores[i] = Math.floor(100 * ratio + 0.5);
        console.log(`SDG ${i}: raw=${rawScores[i]}, exp=${expScores[i]}, ratio=${ratio.toFixed(3)}, norm=${normScores[i]}`);
      } else {
        normScores[i] = 0;
        console.log(`SDG ${i}: raw=${rawScores[i]}, exp=${expScores[i]}, norm=${normScores[i]} (no exposure)`);
      }
    }

    // 正規化スコアの分布を確認
    const validScores = Object.entries(normScores)
      .filter(([_, score]) => score > 0)
      .map(([sdg, score]) => ({ sdg: parseInt(sdg), score }))
      .sort((a, b) => b.score - a.score);
    
    console.log('=== 正規化スコア分布（降順） ===');
    validScores.forEach(({ sdg, score }, index) => {
      console.log(`${index + 1}. SDG ${sdg}: ${score}`);
    });

    return normScores;
  }

  /**
   * 全体関心度を計算 (0-100)
   * overall = floor(100 * Σ(I_q) / (3 * |Q_ans|) + 0.5)
   */
  private calculateOverallInterest(): number {
    const answeredCount = this.responses.length;
    if (answeredCount === 0) return 0;

    const totalIntensity = this.responses.reduce((sum, r) => sum + r.intensity, 0);
    return Math.floor(100 * totalIntensity / (3 * answeredCount) + 0.5);
  }

  /**
   * Top3 SDGを計算
   * 正規化スコア降順、同点時はexposure降順、さらに同点時はSDG番号昇順
   */
  private calculateTop3(): number[] {
    const normScores = this.calculateNormalizedScores();
    const expScores = this.calculateExposureScores();

    // 17個のSDGを正規化スコアの高い順にランキング作成
    const ranking = Object.entries(normScores)
      .filter(([sdg, score]) => expScores[parseInt(sdg)] > 0) // exposure > 0のもののみ
      .map(([sdg, score]) => ({ sdg: parseInt(sdg), score }))
      .sort((a, b) => b.score - a.score); // 正規化スコア降順でランキング
    
    console.log('=== 17個のSDGランキング（正規化スコア降順） ===');
    ranking.forEach((item, index) => {
      console.log(`${index + 1}位: SDG ${item.sdg} (${item.score}点)`);
    });

    // ランキング上位1-3位を取得
    const result = ranking.slice(0, 3).map(item => item.sdg);
    console.log('関心の高いSDGs（上位1-3位）:', result);
    return result;
  }

  /**
   * Bottom3 SDGを計算
   * 正規化スコア昇順、exposure > 0のもののみ
   */
  private calculateBottom3(): number[] {
    const normScores = this.calculateNormalizedScores();
    const expScores = this.calculateExposureScores();

    // 17個のSDGを正規化スコアの高い順にランキング作成（Top3と同じ）
    const ranking = Object.entries(normScores)
      .filter(([sdg, score]) => expScores[parseInt(sdg)] > 0) // exposure > 0のもののみ
      .map(([sdg, score]) => ({ sdg: parseInt(sdg), score }))
      .sort((a, b) => b.score - a.score); // 正規化スコア降順でランキング
    
    console.log('=== 17個のSDGランキング（正規化スコア降順） ===');
    ranking.forEach((item, index) => {
      console.log(`${index + 1}位: SDG ${item.sdg} (${item.score}点)`);
    });

    // ランキング下位15-17位を取得（総数が17未満の場合は最後の3つ）
    const totalCount = ranking.length;
    const startIndex = Math.max(0, totalCount - 3);
    const result = ranking.slice(startIndex).map(item => item.sdg);
    console.log('関心の低いSDGs（下位15-17位）:', result);
    return result;
  }

  /**
   * 完全なスコア計算を実行
   */
  public calculateScores(): ScoreSnapshot {
    console.log('=== スコア計算開始 ===');
    console.log('回答数:', this.responses.length);
    console.log('質問数:', this.questions.length);
    
    // 回答データの詳細を表示
    console.log('=== 回答データ ===');
    this.responses.forEach((response, index) => {
      const question = this.questions.find(q => q.id === response.questionId);
      const selectedOption = question?.options.find(o => o.id === response.optionId);
      console.log(`回答${index + 1}: 質問${response.questionId}, 選択肢${response.optionId}, 強度${response.intensity}, SDGタグ${selectedOption?.sdgTags}`);
    });
    
    const rawScores = this.calculateRawScores();
    const expScores = this.calculateExposureScores();
    const normScores = this.calculateNormalizedScores();
    const overall = this.calculateOverallInterest();
    const top3 = this.calculateTop3();
    const bottom3 = this.calculateBottom3();

    // デバッグ用ログ
    console.log('=== SDGスコア計算結果 ===');
    console.log('Raw scores:', rawScores);
    console.log('Exposure scores:', expScores);
    console.log('Normalized scores:', normScores);
    console.log('Top3:', top3);
    console.log('Bottom3:', bottom3);

    // 各SDGの詳細スコアを表示
    console.log('=== 各SDGの詳細スコア ===');
    for (let i = 1; i <= 17; i++) {
      if (expScores[i] > 0) {
        const ratio = rawScores[i] / expScores[i];
        console.log(`SDG ${i}: raw=${rawScores[i]}, exp=${expScores[i]}, ratio=${ratio.toFixed(3)}, norm=${normScores[i]}`);
      }
    }

    return {
      overall,
      sdg_scores_raw: rawScores,
      sdg_scores_norm: normScores,
      top3,
      bottom3,
      createdAt: new Date(),
    };
  }

  /**
   * クイズ結果を生成（API用）
   */
  public generateQuizResult(): QuizResult {
    const scores = this.calculateScores();
    const actionRecommendations = this.generateActionRecommendations(scores.top3);

    return {
      overall_interest: scores.overall,
      sdg_scores_raw: scores.sdg_scores_raw,
      sdg_scores_norm: scores.sdg_scores_norm,
      top3: scores.top3,
      bottom3: scores.bottom3,
      actionRecommendations,
    };
  }

  /**
   * Top3 SDGに基づくアクション推奨を生成
   */
  private generateActionRecommendations(top3Sdgs: number[]): ActionRecommendation[] {
    const recommendations: ActionRecommendation[] = [];
    
    // 各Top3 SDGに対して3-5個のアクションを推奨
    top3Sdgs.forEach(sdg => {
      const actions = this.getActionRecommendationsForSdg(sdg);
      recommendations.push(...actions);
    });

    return recommendations.slice(0, 15); // 最大15個
  }

  /**
   * 特定のSDGに対するアクション推奨を取得
   */
  private getActionRecommendationsForSdg(sdg: number): ActionRecommendation[] {
    const actionMap: Record<number, ActionRecommendation[]> = {
      1: [
        {
          id: 'poverty-1',
          title: { ja: 'フードバンクに寄付', en: 'Donate to food bank' },
          description: { ja: '地域のフードバンクに食品を寄付する', en: 'Donate food to local food bank' },
          sdgTags: [1, 2],
          difficulty: 'easy',
          estimatedTime: '10分',
        },
        {
          id: 'poverty-2',
          title: { ja: '学習支援ボランティア', en: 'Tutoring volunteer' },
          description: { ja: '低所得家庭の子供たちの学習を支援する', en: 'Support learning for children from low-income families' },
          sdgTags: [1, 4],
          difficulty: 'medium',
          estimatedTime: '2時間',
        },
      ],
      2: [
        {
          id: 'hunger-1',
          title: { ja: '食品ロス削減計画', en: 'Food waste reduction plan' },
          description: { ja: '買い物リストを作成し、必要な分だけ購入する', en: 'Create shopping list and buy only what you need' },
          sdgTags: [2, 12],
          difficulty: 'easy',
          estimatedTime: '5分',
        },
        {
          id: 'hunger-2',
          title: { ja: '地産地消の実践', en: 'Local food consumption' },
          description: { ja: '地元の農産物を積極的に購入する', en: 'Actively purchase local agricultural products' },
          sdgTags: [2, 11],
          difficulty: 'easy',
          estimatedTime: '15分',
        },
      ],
      3: [
        {
          id: 'health-1',
          title: { ja: '定期的な運動習慣', en: 'Regular exercise routine' },
          description: { ja: '週3回、30分の運動を継続する', en: 'Exercise 30 minutes, 3 times a week' },
          sdgTags: [3],
          difficulty: 'medium',
          estimatedTime: '30分',
        },
        {
          id: 'health-2',
          title: { ja: 'メンタルヘルスケア', en: 'Mental health care' },
          description: { ja: 'ストレス管理とリラクゼーションを実践する', en: 'Practice stress management and relaxation' },
          sdgTags: [3],
          difficulty: 'easy',
          estimatedTime: '10分',
        },
      ],
      4: [
        {
          id: 'education-1',
          title: { ja: 'オンライン学習の活用', en: 'Utilize online learning' },
          description: { ja: '無料のオンラインコースでスキルアップする', en: 'Improve skills with free online courses' },
          sdgTags: [4, 9],
          difficulty: 'easy',
          estimatedTime: '1時間',
        },
        {
          id: 'education-2',
          title: { ja: '学習支援活動', en: 'Learning support activities' },
          description: { ja: '地域の学習支援活動に参加する', en: 'Participate in local learning support activities' },
          sdgTags: [4, 10],
          difficulty: 'medium',
          estimatedTime: '2時間',
        },
      ],
      5: [
        {
          id: 'gender-1',
          title: { ja: 'ジェンダー平等の啓発', en: 'Gender equality awareness' },
          description: { ja: 'SNSでジェンダー平等について発信する', en: 'Share about gender equality on social media' },
          sdgTags: [5, 16],
          difficulty: 'easy',
          estimatedTime: '15分',
        },
        {
          id: 'gender-2',
          title: { ja: 'インクルーシブな環境づくり', en: 'Create inclusive environment' },
          description: { ja: '職場や学校で多様性を尊重する環境を作る', en: 'Create an environment that respects diversity at work or school' },
          sdgTags: [5, 10],
          difficulty: 'medium',
          estimatedTime: '30分',
        },
      ],
      6: [
        {
          id: 'water-1',
          title: { ja: '節水習慣の実践', en: 'Practice water conservation' },
          description: { ja: 'シャワー時間を短縮し、水を無駄にしない', en: 'Shorten shower time and avoid wasting water' },
          sdgTags: [6],
          difficulty: 'easy',
          estimatedTime: '5分',
        },
        {
          id: 'water-2',
          title: { ja: '雨水活用システム', en: 'Rainwater utilization system' },
          description: { ja: '雨水を活用したガーデニングや清掃を行う', en: 'Use rainwater for gardening and cleaning' },
          sdgTags: [6, 15],
          difficulty: 'medium',
          estimatedTime: '1時間',
        },
      ],
      7: [
        {
          id: 'energy-1',
          title: { ja: '省エネ家電の使用', en: 'Use energy-efficient appliances' },
          description: { ja: 'LED電球や省エネ家電を積極的に使用する', en: 'Actively use LED bulbs and energy-efficient appliances' },
          sdgTags: [7, 9],
          difficulty: 'easy',
          estimatedTime: '20分',
        },
        {
          id: 'energy-2',
          title: { ja: '再生可能エネルギーの選択', en: 'Choose renewable energy' },
          description: { ja: '再生可能エネルギーを提供する電力会社を選択する', en: 'Choose electricity companies that provide renewable energy' },
          sdgTags: [7, 13],
          difficulty: 'medium',
          estimatedTime: '30分',
        },
      ],
      8: [
        {
          id: 'work-1',
          title: { ja: 'フェアトレード商品の購入', en: 'Buy fair trade products' },
          description: { ja: '公正な労働環境で作られた商品を選ぶ', en: 'Choose products made in fair working conditions' },
          sdgTags: [8, 10],
          difficulty: 'easy',
          estimatedTime: '10分',
        },
        {
          id: 'work-2',
          title: { ja: 'スキルアップの投資', en: 'Invest in skill development' },
          description: { ja: '自分のスキル向上に時間とお金を投資する', en: 'Invest time and money in improving your skills' },
          sdgTags: [8, 4],
          difficulty: 'medium',
          estimatedTime: '2時間',
        },
      ],
      9: [
        {
          id: 'innovation-1',
          title: { ja: 'デジタルスキルの向上', en: 'Improve digital skills' },
          description: { ja: 'プログラミングやデジタルツールを学ぶ', en: 'Learn programming and digital tools' },
          sdgTags: [9, 4],
          difficulty: 'medium',
          estimatedTime: '1時間',
        },
        {
          id: 'innovation-2',
          title: { ja: '持続可能な技術の学習', en: 'Learn sustainable technology' },
          description: { ja: '環境に優しい技術やイノベーションについて学ぶ', en: 'Learn about environmentally friendly technologies and innovations' },
          sdgTags: [9, 13],
          difficulty: 'medium',
          estimatedTime: '1時間',
        },
      ],
      10: [
        {
          id: 'inequality-1',
          title: { ja: '多様性の尊重', en: 'Respect diversity' },
          description: { ja: '異なる背景を持つ人々の意見を尊重する', en: 'Respect opinions of people from different backgrounds' },
          sdgTags: [10, 16],
          difficulty: 'easy',
          estimatedTime: '5分',
        },
        {
          id: 'inequality-2',
          title: { ja: 'インクルーシブな活動', en: 'Inclusive activities' },
          description: { ja: '誰もが参加できる活動を企画・参加する', en: 'Plan and participate in activities that everyone can join' },
          sdgTags: [10, 17],
          difficulty: 'medium',
          estimatedTime: '1時間',
        },
      ],
      11: [
        {
          id: 'cities-1',
          title: { ja: '公共交通の利用', en: 'Use public transportation' },
          description: { ja: '車の代わりに電車やバスを積極的に利用する', en: 'Actively use trains and buses instead of cars' },
          sdgTags: [11, 13],
          difficulty: 'easy',
          estimatedTime: '10分',
        },
        {
          id: 'cities-2',
          title: { ja: '地域コミュニティの参加', en: 'Participate in local community' },
          description: { ja: '地域のイベントや活動に積極的に参加する', en: 'Actively participate in local events and activities' },
          sdgTags: [11, 17],
          difficulty: 'medium',
          estimatedTime: '2時間',
        },
      ],
      12: [
        {
          id: 'consumption-1',
          title: { ja: 'リサイクルの徹底', en: 'Thorough recycling' },
          description: { ja: '分別回収を正しく行い、リサイクルを促進する', en: 'Properly sort waste and promote recycling' },
          sdgTags: [12],
          difficulty: 'easy',
          estimatedTime: '5分',
        },
        {
          id: 'consumption-2',
          title: { ja: '持続可能な消費', en: 'Sustainable consumption' },
          description: { ja: '長く使える質の良い商品を選ぶ', en: 'Choose high-quality products that last long' },
          sdgTags: [12, 8],
          difficulty: 'easy',
          estimatedTime: '15分',
        },
      ],
      13: [
        {
          id: 'climate-1',
          title: { ja: 'カーボンフットプリントの削減', en: 'Reduce carbon footprint' },
          description: { ja: '日常の行動でCO2排出量を減らす', en: 'Reduce CO2 emissions through daily actions' },
          sdgTags: [13],
          difficulty: 'easy',
          estimatedTime: '10分',
        },
        {
          id: 'climate-2',
          title: { ja: '気候変動の学習', en: 'Learn about climate change' },
          description: { ja: '気候変動について学び、情報を共有する', en: 'Learn about climate change and share information' },
          sdgTags: [13, 4],
          difficulty: 'easy',
          estimatedTime: '30分',
        },
      ],
      14: [
        {
          id: 'oceans-1',
          title: { ja: '海洋プラスチック削減', en: 'Reduce ocean plastic' },
          description: { ja: '使い捨てプラスチックの使用を減らす', en: 'Reduce use of single-use plastics' },
          sdgTags: [14, 12],
          difficulty: 'easy',
          estimatedTime: '5分',
        },
        {
          id: 'oceans-2',
          title: { ja: 'ビーチクリーンアップ', en: 'Beach cleanup' },
          description: { ja: '海岸の清掃活動に参加する', en: 'Participate in beach cleanup activities' },
          sdgTags: [14, 11],
          difficulty: 'medium',
          estimatedTime: '2時間',
        },
      ],
      15: [
        {
          id: 'land-1',
          title: { ja: '生物多様性の保護', en: 'Protect biodiversity' },
          description: { ja: '自然環境を守る活動に参加する', en: 'Participate in activities to protect natural environment' },
          sdgTags: [15],
          difficulty: 'medium',
          estimatedTime: '1時間',
        },
        {
          id: 'land-2',
          title: { ja: '植樹活動', en: 'Tree planting' },
          description: { ja: '地域の植樹活動に参加する', en: 'Participate in local tree planting activities' },
          sdgTags: [15, 13],
          difficulty: 'medium',
          estimatedTime: '2時間',
        },
      ],
      16: [
        {
          id: 'peace-1',
          title: { ja: '平和のための対話', en: 'Dialogue for peace' },
          description: { ja: '異なる意見を持つ人々との対話を促進する', en: 'Promote dialogue with people who have different opinions' },
          sdgTags: [16, 17],
          difficulty: 'medium',
          estimatedTime: '1時間',
        },
        {
          id: 'peace-2',
          title: { ja: '透明性の促進', en: 'Promote transparency' },
          description: { ja: '情報公開や透明性を求める活動に参加する', en: 'Participate in activities demanding information disclosure and transparency' },
          sdgTags: [16],
          difficulty: 'medium',
          estimatedTime: '30分',
        },
      ],
      17: [
        {
          id: 'partnership-1',
          title: { ja: '国際協力の支援', en: 'Support international cooperation' },
          description: { ja: '国際的なNGOや団体を支援する', en: 'Support international NGOs and organizations' },
          sdgTags: [17, 1],
          difficulty: 'easy',
          estimatedTime: '10分',
        },
        {
          id: 'partnership-2',
          title: { ja: '多様なパートナーシップ', en: 'Diverse partnerships' },
          description: { ja: '異なる分野の人々と協力する', en: 'Collaborate with people from different fields' },
          sdgTags: [17, 10],
          difficulty: 'medium',
          estimatedTime: '1時間',
        },
      ],
    };

    return actionMap[sdg] || [];
  }
}

/**
 * クイズ回答からスコアを計算する便利関数
 */
export function calculateQuizScores(
  questions: Question[],
  submissions: QuizSubmission[]
): QuizResult {
  // QuizSubmissionをResponseに変換
  const responses: Response[] = submissions.map(sub => ({
    sessionId: 'temp', // 実際のセッションIDは後で設定
    questionId: sub.questionId,
    optionId: sub.optionId,
    intensity: sub.intensity,
    createdAt: new Date(),
  }));

  const engine = new ScoringEngine(questions, responses);
  return engine.generateQuizResult();
}
