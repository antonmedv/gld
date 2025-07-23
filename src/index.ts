// Core lorem ipsum word bank with weights for natural distribution
const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
  'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
  'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo',
  'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit', 'fugit',
  'consequuntur', 'magni', 'dolores', 'ratione', 'sequi', 'nesciunt', 'neque',
  'porro', 'quisquam', 'dolorem', 'adipisci', 'numquam', 'eius', 'modi',
  'tempora', 'incidunt', 'magnam', 'quaerat', 'voluptatem', 'fuga', 'harum',
  'quidem', 'rerum', 'facilis', 'expedita', 'distinctio', 'nam', 'libero',
  'tempore', 'cum', 'soluta', 'nobis', 'eligendi', 'optio', 'cumque', 'nihil',
  'impedit', 'quo', 'minus', 'maxime', 'placeat', 'facere', 'possimus', 'omnis',
  'assumenda', 'repellendus', 'temporibus', 'autem', 'quibusdam', 'officiis',
  'debitis', 'necessitatibus', 'saepe', 'eveniet', 'voluptates', 'repudiandae',
  'recusandae', 'itaque', 'earum', 'hic', 'tenetur', 'a', 'sapiente', 'delectus',
  'reiciendis', 'voluptatibus', 'maiores', 'alias', 'perferendis', 'doloribus',
  'asperiores', 'repellat',
]

// Alternative word sets for variety
const TECH_WORDS = [
  'algorithm', 'binary', 'code', 'data', 'encryption', 'framework', 'git',
  'hash', 'interface', 'javascript', 'kernel', 'library', 'memory', 'network',
  'object', 'protocol', 'query', 'repository', 'server', 'token', 'unicode',
  'variable', 'widget', 'xml', 'yaml', 'zip', 'api', 'bug', 'cache', 'debug',
  'exception', 'function', 'garbage', 'handler', 'index', 'json', 'key',
  'lambda', 'module', 'null', 'operator', 'parameter', 'queue', 'runtime',
  'stack', 'thread', 'unit', 'version', 'webhook', 'xhr', 'yield', 'zone',
]

const BUSINESS_WORDS = [
  'synergy', 'leverage', 'paradigm', 'optimize', 'streamline', 'scalable',
  'innovative', 'disruptive', 'agile', 'pivot', 'ecosystem', 'bandwidth',
  'holistic', 'robust', 'dynamic', 'strategic', 'tactical', 'organic',
  'actionable', 'seamless', 'cross-platform', 'best-practice', 'workflow',
  'deliverable', 'milestone', 'stakeholder', 'roadmap', 'framework',
  'methodology', 'implementation', 'integration', 'collaboration', 'efficiency',
  'productivity', 'performance', 'metrics', 'analytics', 'insights',
  'engagement', 'conversion', 'retention', 'acquisition', 'monetization',
  'vertical', 'horizontal', 'enterprise', 'solution', 'platform', 'architecture',
]

// Word frequency weights for more natural text generation
const WORD_WEIGHTS: Record<string, number> = {
  'lorem': 0.8, 'ipsum': 0.7, 'dolor': 0.6, 'sit': 0.9, 'amet': 0.8,
  'et': 1.2, 'ut': 1.1, 'in': 1.3, 'ad': 1.0, 'sed': 0.9, 'do': 1.1,
  'a': 1.4, 'ex': 0.8, 'ea': 0.7, 'id': 0.9, 'ab': 0.6, 'qui': 0.8,
  'cum': 0.7, 'non': 1.0, 'est': 1.1, 'sunt': 0.8, 'aut': 0.9, 'quo': 0.7,
}

export interface GeneratorOptions {
  /** Number of words to generate */
  words?: number;
  /** Number of sentences to generate */
  sentences?: number;
  /** Number of paragraphs to generate */
  paragraphs?: number;
  /** Minimum words per sentence (default: 8) */
  minWordsPerSentence?: number;
  /** Maximum words per sentence (default: 18) */
  maxWordsPerSentence?: number;
  /** Minimum sentences per paragraph (default: 3) */
  minSentencesPerParagraph?: number;
  /** Maximum sentences per paragraph (default: 7) */
  maxSentencesPerParagraph?: number;
  /** Start with "Lorem ipsum dolor sit amet..." (default: true) */
  startWithLorem?: boolean;
  /** Capitalize first word of sentences (default: true) */
  capitalize?: boolean;
  /** Add punctuation (default: true) */
  punctuation?: boolean;
  /** Word set to use */
  wordSet?: 'classic' | 'tech' | 'business' | 'mixed';
  /** Custom word list */
  customWords?: string[];
  /** Random seed for reproducible output */
  seed?: number;
  /** HTML output with paragraph tags */
  html?: boolean;
  /** Markdown output */
  markdown?: boolean;
}

export interface GeneratorStats {
  wordsGenerated: number;
  sentencesGenerated: number;
  paragraphsGenerated: number;
  averageWordsPerSentence: number;
  uniqueWords: number;
}

class SeededRandom {
  private seed: number

  constructor(seed: number = Date.now()) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)]
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }
}

export class GreatLoremDistributor {
  private random: SeededRandom
  private wordBank: string[]
  private stats: GeneratorStats = {
    wordsGenerated: 0,
    sentencesGenerated: 0,
    paragraphsGenerated: 0,
    averageWordsPerSentence: 0,
    uniqueWords: 0,
  }

  constructor(seed?: number) {
    this.random = new SeededRandom(seed)
    this.wordBank = LOREM_WORDS
  }

  private selectWordBank(wordSet: string, customWords?: string[]): string[] {
    if (customWords && customWords.length > 0) {
      return customWords
    }

    switch (wordSet) {
      case 'tech':
        return TECH_WORDS
      case 'business':
        return BUSINESS_WORDS
      case 'mixed':
        return [...LOREM_WORDS, ...TECH_WORDS.slice(0, 20), ...BUSINESS_WORDS.slice(0, 20)]
      case 'classic':
      default:
        return LOREM_WORDS
    }
  }

  private getWeightedWord(words: string[]): string {
    // Use weights for classic lorem words, random for others
    if (this.wordBank === LOREM_WORDS) {
      const totalWeight = words.reduce((sum, word) => sum + (WORD_WEIGHTS[word] || 0.5), 0)
      let random = this.random.next() * totalWeight

      for (const word of words) {
        random -= WORD_WEIGHTS[word] || 0.5
        if (random <= 0) return word
      }
    }

    return this.random.pick(words)
  }

  private generateSentence(
    minWords: number,
    maxWords: number,
    startWithLorem: boolean = false,
    isFirstSentence: boolean = false,
  ): string {
    let wordCount = this.random.nextInt(minWords, maxWords)
    const words: string[] = []

    const loremPrefix = ['lorem', 'ipsum', 'dolor', 'sit', 'amet']
    const actualLoremWords = startWithLorem && isFirstSentence ? loremPrefix : []

    // Ensure we don't try to add more Lorem words than the sentence length
    const initialWordCount = Math.min(wordCount, actualLoremWords.length)
    words.push(...actualLoremWords.slice(0, initialWordCount))

    for (let i = words.length; i < wordCount; i++) {
      words.push(this.getWeightedWord(this.wordBank))
    }


    // Capitalize first word
    if (words.length > 0) {
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    }

    return words.join(' ')
  }

  private generateParagraph(
    minSentences: number,
    maxSentences: number,
    minWordsPerSentence: number,
    maxWordsPerSentence: number,
    startWithLorem: boolean = false,
    isFirstParagraph: boolean = false,
  ): string {
    const sentenceCount = this.random.nextInt(minSentences, maxSentences)
    const sentences: string[] = []

    for (let i = 0; i < sentenceCount; i++) {
      const isFirstSentence = isFirstParagraph && i === 0
      const sentence = this.generateSentence(
        minWordsPerSentence,
        maxWordsPerSentence,
        startWithLorem, // Pass startWithLorem as is
        isFirstSentence,
      )
      sentences.push(sentence + '.')
    }

    this.stats.sentencesGenerated += sentenceCount
    return sentences.join(' ')
  }

  private formatOutput(text: string, options: GeneratorOptions): string {
    if (options.html) {
      const paragraphs = text.split('\n\n')
      return paragraphs.map(p => `<p>${p}</p>`).join('\n')
    }

    if (options.markdown) {
      return text.split('\n\n').join('\n\n')
    }

    return text
  }

  private calculateStats(text: string): void {
    const words = text.split(/\s+/).filter(word => word.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^\w]/g, '')))

    this.stats.wordsGenerated = words.length
    this.stats.averageWordsPerSentence = this.stats.sentencesGenerated > 0
      ? words.length / this.stats.sentencesGenerated
      : 0
    this.stats.uniqueWords = uniqueWords.size
  }

  /**
   * Generate lorem ipsum text with specified options
   */
  generate(options: GeneratorOptions = {}): string {
    // Reset stats
    this.stats = {
      wordsGenerated: 0,
      sentencesGenerated: 0,
      paragraphsGenerated: 0,
      averageWordsPerSentence: 0,
      uniqueWords: 0,
    }

    // Set defaults
    const opts = {
      minWordsPerSentence: 8,
      maxWordsPerSentence: 18,
      minSentencesPerParagraph: 3,
      maxSentencesPerParagraph: 7,
      startWithLorem: true,
      capitalize: true,
      punctuation: true,
      wordSet: 'classic' as const,
      ...options,
    }

    // Ensure min is not greater than max for sentence and paragraph word counts
    if (opts.minWordsPerSentence > opts.maxWordsPerSentence) {
      [opts.minWordsPerSentence, opts.maxWordsPerSentence] = [opts.maxWordsPerSentence, opts.minWordsPerSentence]
    }
    if (opts.minSentencesPerParagraph > opts.maxSentencesPerParagraph) {
      [opts.minSentencesPerParagraph, opts.maxSentencesPerParagraph] = [opts.maxSentencesPerParagraph, opts.minSentencesPerParagraph]
    }

    // Update word bank
    this.wordBank = this.selectWordBank(opts.wordSet, opts.customWords)

    let result = ''

    // Handle zero/negative counts early
    if ((opts.words !== undefined && opts.words <= 0) ||
      (opts.sentences !== undefined && opts.sentences <= 0) ||
      (opts.paragraphs !== undefined && opts.paragraphs <= 0)) {
      return ''
    }

    // Generate by words
    if (opts.words) {
      const words: string[] = []
      let isFirstSentence = true

      while (words.length < opts.words) {
        const remainingWords = opts.words - words.length
        const currentMinWords = Math.min(opts.minWordsPerSentence, remainingWords)
        const currentMaxWords = Math.min(opts.maxWordsPerSentence, remainingWords)

        if (currentMinWords <= 0) break // No more words to add

        const sentence = this.generateSentence(
          currentMinWords,
          currentMaxWords,
          opts.startWithLorem, // Pass startWithLorem as is
          isFirstSentence,
        )

        const sentenceWords = sentence.split(' ')
        words.push(...sentenceWords.slice(0, remainingWords))

        if (isFirstSentence) {
          this.stats.sentencesGenerated++ // Count the first sentence
        }
        isFirstSentence = false
      }

      result = words.join(' ')
      if (opts.punctuation && result.length > 0) {
        result += '.'
      }
    }
    // Generate by sentences
    else if (opts.sentences) {
      const sentences: string[] = []

      for (let i = 0; i < opts.sentences; i++) {
        const sentence = this.generateSentence(
          opts.minWordsPerSentence,
          opts.maxWordsPerSentence,
          opts.startWithLorem, // Pass startWithLorem as is
          i === 0,
        )
        sentences.push(sentence + (opts.punctuation ? '.' : ''))
      }

      result = sentences.join(' ')
      this.stats.sentencesGenerated = opts.sentences
    }
    // Generate by paragraphs (default)
    else {
      const paragraphCount = opts.paragraphs || 1
      const paragraphs: string[] = []

      for (let i = 0; i < paragraphCount; i++) {
        const paragraph = this.generateParagraph(
          opts.minSentencesPerParagraph,
          opts.maxSentencesPerParagraph,
          opts.minWordsPerSentence,
          opts.maxWordsPerSentence,
          opts.startWithLorem,
          i === 0,
        )
        paragraphs.push(paragraph)
      }

      result = paragraphs.join('\n\n')
      this.stats.paragraphsGenerated = paragraphCount
    }

    this.calculateStats(result)
    return this.formatOutput(result, opts)
  }

  /**
   * Generate specified number of words
   */
  words(count: number, options: Omit<GeneratorOptions, 'words'> = {}): string {
    return this.generate({...options, words: count})
  }

  /**
   * Generate specified number of sentences
   */
  sentences(count: number, options: Omit<GeneratorOptions, 'sentences'> = {}): string {
    return this.generate({...options, sentences: count})
  }

  /**
   * Generate specified number of paragraphs
   */
  paragraphs(count: number, options: Omit<GeneratorOptions, 'paragraphs'> = {}): string {
    return this.generate({...options, paragraphs: count})
  }

  /**
   * Get generation statistics from last generate() call
   */
  getStats(): GeneratorStats {
    return {...this.stats}
  }

  /**
   * Set random seed for reproducible output
   */
  setSeed(seed: number): void {
    this.random = new SeededRandom(seed)
  }

  /**
   * Generate a quick Lorem ipsum paragraph (convenience method)
   */
  quick(): string {
    return this.generate({paragraphs: 1})
  }

  /**
   * Generate Lorem ipsum for web development (HTML formatted)
   */
  html(paragraphs: number = 3): string {
    return this.generate({paragraphs, html: true})
  }

  /**
   * Generate Lorem ipsum for documentation (Markdown formatted)
   */
  markdown(paragraphs: number = 2): string {
    return this.generate({paragraphs, markdown: true})
  }
}

// Default instance for convenience
export const gld = new GreatLoremDistributor()

// Convenience functions using default instance
export const words = (count: number, options?: Omit<GeneratorOptions, 'words'>) =>
  gld.words(count, options)

export const sentences = (count: number, options?: Omit<GeneratorOptions, 'sentences'>) =>
  gld.sentences(count, options)

export const paragraphs = (count: number, options?: Omit<GeneratorOptions, 'paragraphs'>) =>
  gld.paragraphs(count, options)

export const generate = (options?: GeneratorOptions) => gld.generate(options)

export const quick = () => gld.quick()

export const html = (paragraphs?: number) => gld.html(paragraphs)

export const markdown = (paragraphs?: number) => gld.markdown(paragraphs)

export const getStats = () => gld.getStats()

export const setSeed = (seed: number) => gld.setSeed(seed)

// Create new instance with custom seed
export const createGenerator = (seed?: number) => new GreatLoremDistributor(seed)

export default gld
