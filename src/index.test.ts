import {describe, it, expect, beforeEach} from 'vitest'
import {
  GreatLoremDistributor,
  gld,
  words,
  sentences,
  paragraphs,
  generate,
  quick,
  html,
  markdown,
  getStats,
  setSeed,
  createGenerator,
  type GeneratorOptions,
  type GeneratorStats,
} from '../src/index'

describe('GreatLoremDistributor', () => {
  let generator: GreatLoremDistributor

  beforeEach(() => {
    generator = new GreatLoremDistributor(12345) // Fixed seed for reproducible tests
  })

  describe('Basic Generation', () => {
    it('should generate text with default options', () => {
      const result = generator.generate()
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should start with "Lorem ipsum" by default', () => {
      const result = generator.generate()
      expect(result.toLowerCase()).toMatch(/^lorem ipsum/)
    })

    it('should generate different content with different seeds', () => {
      const gen1 = new GreatLoremDistributor(111)
      const gen2 = new GreatLoremDistributor(222)

      const result1 = gen1.generate()
      const result2 = gen2.generate()

      expect(result1).not.toBe(result2)
    })

    it('should generate same content with same seed', () => {
      const gen1 = new GreatLoremDistributor(12345)
      const gen2 = new GreatLoremDistributor(12345)

      const result1 = gen1.generate()
      const result2 = gen2.generate()

      expect(result1).toBe(result2)
    })
  })

  describe('Word Generation', () => {
    it('should generate exact number of words', () => {
      const wordCount = 25
      const result = generator.words(wordCount)
      const actualWords = result.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0)

      expect(actualWords).toHaveLength(wordCount)
    })

    it('should handle single word generation', () => {
      const result = generator.words(1)
      const words = result.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0)

      expect(words).toHaveLength(1)
      expect(result).toMatch(/^[A-Z][a-z]*\.?$/) // Capitalized word with optional period
    })

    it('should handle large word counts', () => {
      const wordCount = 1000
      const result = generator.words(wordCount)
      const actualWords = result.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0)

      expect(actualWords).toHaveLength(wordCount)
    })

    it('should respect startWithLorem option for words', () => {
      const result = generator.words(5, {startWithLorem: true})
      expect(result.toLowerCase()).toMatch(/^lorem ipsum dolor sit amet/)
    })

    it('should not start with lorem when disabled', () => {
      const result = generator.words(10, {startWithLorem: false})
      expect(result.toLowerCase()).not.toMatch(/^lorem ipsum/)
    })
  })

  describe('Sentence Generation', () => {
    it('should generate exact number of sentences', () => {
      const sentenceCount = 5
      const result = generator.sentences(sentenceCount)
      const actualSentences = result.split('.').filter(s => s.trim().length > 0)

      expect(actualSentences).toHaveLength(sentenceCount)
    })

    it('should respect word count limits per sentence', () => {
      const result = generator.sentences(3, {
        minWordsPerSentence: 5,
        maxWordsPerSentence: 8,
      })

      const sentences = result.split('.').filter(s => s.trim().length > 0)

      sentences.forEach(sentence => {
        const words = sentence.trim().split(/\s+/)
        expect(words.length).toBeGreaterThanOrEqual(5)
        expect(words.length).toBeLessThanOrEqual(8)
      })
    })

    it('should capitalize first word of each sentence', () => {
      const result = generator.sentences(3)
      const sentences = result.split('.').filter(s => s.trim().length > 0)

      sentences.forEach(sentence => {
        const firstChar = sentence.trim().charAt(0)
        expect(firstChar).toMatch(/[A-Z]/)
      })
    })
  })

  describe('Paragraph Generation', () => {
    it('should generate exact number of paragraphs', () => {
      const paragraphCount = 3
      const result = generator.paragraphs(paragraphCount)
      const actualParagraphs = result.split('\n\n').filter(p => p.trim().length > 0)

      expect(actualParagraphs).toHaveLength(paragraphCount)
    })

    it('should respect sentence count limits per paragraph', () => {
      const result = generator.paragraphs(2, {
        minSentencesPerParagraph: 2,
        maxSentencesPerParagraph: 4,
      })

      const paragraphs = result.split('\n\n')

      paragraphs.forEach(paragraph => {
        const sentences = paragraph.split('.').filter(s => s.trim().length > 0)
        expect(sentences.length).toBeGreaterThanOrEqual(2)
        expect(sentences.length).toBeLessThanOrEqual(4)
      })
    })
  })

  describe('Word Sets', () => {
    it('should use classic words by default', () => {
      const result = generator.generate({words: 50, wordSet: 'classic'})
      expect(result.toLowerCase()).toContain('lorem')
    })

    it('should use tech words when specified', () => {
      const result = generator.generate({words: 100, wordSet: 'tech', startWithLorem: false})
      const techWords = ['algorithm', 'binary', 'code', 'data', 'api', 'json', 'framework']
      const hasTechy = techWords.some(word => result.toLowerCase().includes(word))
      expect(hasTechy).toBe(true)
    })

    it('should use business words when specified', () => {
      const result = generator.generate({words: 100, wordSet: 'business', startWithLorem: false})
      const businessWords = ['synergy', 'leverage', 'paradigm', 'optimize', 'scalable', 'agile']
      const hasBusiness = businessWords.some(word => result.toLowerCase().includes(word))
      expect(hasBusiness).toBe(true)
    })

    it('should use mixed word set', () => {
      const result = generator.generate({words: 200, wordSet: 'mixed', startWithLorem: false})
      expect(result.length).toBeGreaterThan(0)
      // Mixed should contain variety - hard to test specific words but should be diverse
    })

    it('should use custom words when provided', () => {
      const customWords = ['apple', 'banana', 'cherry', 'date', 'elderberry']
      const result = generator.generate({
        words: 20,
        customWords,
        startWithLorem: false,
      })

      const hasCustomWords = customWords.some(word => result.toLowerCase().includes(word))
      expect(hasCustomWords).toBe(true)
    })
  })

  describe('Output Formatting', () => {
    it('should generate HTML output', () => {
      const result = generator.generate({paragraphs: 2, html: true})
      expect(result).toContain('<p>')
      expect(result).toContain('</p>')

      const pTags = result.match(/<p>/g)
      expect(pTags).toHaveLength(2)
    })

    it('should generate markdown output', () => {
      const result = generator.generate({paragraphs: 3, markdown: true})
      const paragraphs = result.split('\n\n')
      expect(paragraphs).toHaveLength(3)
    })

    it('should handle punctuation option', () => {
      const withPunctuation = generator.generate({words: 10, punctuation: true})
      const withoutPunctuation = generator.generate({words: 10, punctuation: false})

      expect(withPunctuation).toContain('.')
      expect(withoutPunctuation).not.toContain('.')
    })
  })

  describe('Statistics', () => {
    it('should track generation statistics', () => {
      generator.generate({paragraphs: 2})
      const stats = generator.getStats()

      expect(stats.wordsGenerated).toBeGreaterThan(0)
      expect(stats.sentencesGenerated).toBeGreaterThan(0)
      expect(stats.paragraphsGenerated).toBe(2)
      expect(stats.averageWordsPerSentence).toBeGreaterThan(0)
      expect(stats.uniqueWords).toBeGreaterThan(0)
    })

    it('should calculate correct word count', () => {
      const wordCount = 50
      generator.words(wordCount)
      const stats = generator.getStats()

      expect(stats.wordsGenerated).toBe(wordCount)
    })

    it('should calculate unique words correctly', () => {
      generator.generate({words: 100})
      const stats = generator.getStats()

      expect(stats.uniqueWords).toBeGreaterThan(0)
      expect(stats.uniqueWords).toBeLessThanOrEqual(stats.wordsGenerated)
    })
  })

  describe('Convenience Methods', () => {
    it('should provide quick method', () => {
      const result = generator.quick()
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should provide html method', () => {
      const result = generator.html(2)
      expect(result).toContain('<p>')
      expect(result).toContain('</p>')
    })

    it('should provide markdown method', () => {
      const result = generator.markdown(2)
      const paragraphs = result.split('\n\n')
      expect(paragraphs.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Seed Management', () => {
    it('should allow seed changes', () => {
      const result1 = generator.generate()
      generator.setSeed(54321)
      const result2 = generator.generate()

      expect(result1).not.toBe(result2)
    })

    it('should produce consistent results after seed reset', () => {
      const originalSeed = 12345
      generator.setSeed(originalSeed)
      const result1 = generator.generate()

      generator.setSeed(99999)
      generator.generate() // Generate something different

      generator.setSeed(originalSeed)
      const result2 = generator.generate()

      expect(result1).toBe(result2)
    })
  })
})

describe('Functional API', () => {
  beforeEach(() => {
    setSeed(12345) // Set consistent seed for tests
  })

  describe('Export Functions', () => {
    it('should export words function', () => {
      const result = words(20)
      const wordCount = result.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0)
      expect(wordCount).toHaveLength(20)
    })

    it('should export sentences function', () => {
      const result = sentences(3)
      const sentenceCount = result.split('.').filter(s => s.trim().length > 0)
      expect(sentenceCount).toHaveLength(3)
    })

    it('should export paragraphs function', () => {
      const result = paragraphs(2)
      const paragraphCount = result.split('\n\n').filter(p => p.trim().length > 0)
      expect(paragraphCount).toHaveLength(2)
    })

    it('should export generate function', () => {
      const result = generate({words: 15})
      const wordCount = result.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0)
      expect(wordCount).toHaveLength(15)
    })

    it('should export quick function', () => {
      const result = quick()
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })

    it('should export html function', () => {
      const result = html(2)
      expect(result).toContain('<p>')
      expect(result).toContain('</p>')
    })

    it('should export markdown function', () => {
      const result = markdown(2)
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })

    it('should export getStats function', () => {
      words(50)
      const stats = getStats()
      expect(stats.wordsGenerated).toBe(50)
    })

    it('should export setSeed function', () => {
      setSeed(11111)
      const result1 = quick()
      setSeed(11111)
      const result2 = quick()
      expect(result1).toBe(result2)
    })

    it('should export createGenerator function', () => {
      const customGen = createGenerator(99999)
      const result = customGen.quick()
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })

  describe('Default Instance Behavior', () => {
    it('should use shared state across functional calls', () => {
      setSeed(55555)
      const result1 = words(10)
      setSeed(55555)
      const result2 = words(10)
      expect(result1).toBe(result2)
    })
  })
})

describe('Edge Cases', () => {
  let generator: GreatLoremDistributor

  beforeEach(() => {
    generator = new GreatLoremDistributor(12345)
  })

  describe('Boundary Values', () => {
    it('should handle zero word generation gracefully', () => {
      const result = generator.words(0)
      expect(result).toBe('')
    })

    it('should handle zero sentence generation gracefully', () => {
      const result = generator.sentences(0)
      expect(result).toBe('')
    })

    it('should handle zero paragraph generation gracefully', () => {
      const result = generator.paragraphs(0)
      expect(result).toBe('')
    })

    it('should handle minimum word limits', () => {
      const result = generator.generate({
        sentences: 1,
        minWordsPerSentence: 1,
        maxWordsPerSentence: 1,
      })
      const words = result.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0)
      expect(words).toHaveLength(1)
    })

    it('should handle minimum sentence limits', () => {
      const result = generator.generate({
        paragraphs: 1,
        minSentencesPerParagraph: 1,
        maxSentencesPerParagraph: 1,
      })
      const sentences = result.split('.').filter(s => s.trim().length > 0)
      expect(sentences).toHaveLength(1)
    })
  })

  describe('Invalid Inputs', () => {
    it('should handle empty custom word arrays', () => {
      const result = generator.generate({
        words: 10,
        customWords: [],
        wordSet: 'classic',
      })
      expect(result).toBeTruthy()
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle negative values gracefully', () => {
      // Should treat negative as 0 or minimum value
      const result = generator.words(-5)
      expect(result).toBe('')
    })

    it('should handle invalid word set gracefully', () => {
      const result = generator.generate({
        words: 10,
        wordSet: 'invalid' as any,
      })
      expect(result).toBeTruthy() // Should fall back to classic
    })
  })

  describe('Range Validation', () => {
    it('should handle min > max word ranges', () => {
      // Should swap or use sensible defaults
      const result = generator.generate({
        sentences: 1,
        minWordsPerSentence: 20,
        maxWordsPerSentence: 5,
      })
      expect(result).toBeTruthy()
    })

    it('should handle min > max sentence ranges', () => {
      const result = generator.generate({
        paragraphs: 1,
        minSentencesPerParagraph: 5,
        maxSentencesPerParagraph: 2,
      })
      expect(result).toBeTruthy()
    })
  })
})

describe('Performance Tests', () => {
  let generator: GreatLoremDistributor

  beforeEach(() => {
    generator = new GreatLoremDistributor()
  })

  it('should handle large word counts efficiently', () => {
    const startTime = Date.now()
    const result = generator.words(10000)
    const endTime = Date.now()

    expect(result).toBeTruthy()
    expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
  })

  it('should handle many paragraphs efficiently', () => {
    const startTime = Date.now()
    const result = generator.paragraphs(100)
    const endTime = Date.now()

    expect(result).toBeTruthy()
    expect(endTime - startTime).toBeLessThan(2000) // Should complete within 2 seconds
  })

  it('should maintain consistent performance across multiple calls', () => {
    const times: number[] = []

    for (let i = 0; i < 10; i++) {
      const startTime = Date.now()
      generator.paragraphs(10)
      const endTime = Date.now()
      times.push(endTime - startTime)
    }

    const avgTime = times.reduce((a, b) => a + b) / times.length
    const maxTime = Math.max(...times)

    expect(avgTime).toBeLessThan(100) // Average should be fast
    expect(maxTime).toBeLessThan(500) // No single call should be too slow
  })
})

describe('Integration Tests', () => {
  it('should work with all options combined', () => {
    const generator = createGenerator(42)
    const result = generator.generate({
      paragraphs: 3,
      minWordsPerSentence: 8,
      maxWordsPerSentence: 15,
      minSentencesPerParagraph: 2,
      maxSentencesPerParagraph: 5,
      wordSet: 'mixed',
      startWithLorem: true,
      html: true,
      punctuation: true,
      capitalize: true,
    })

    expect(result).toContain('<p>')
    expect(result).toContain('</p>')
    expect(result.toLowerCase()).toMatch(/^<p>lorem ipsum/)

    const stats = generator.getStats()
    expect(stats.paragraphsGenerated).toBe(3)
    expect(stats.wordsGenerated).toBeGreaterThan(0)
    expect(stats.sentencesGenerated).toBeGreaterThan(0)
  })

  it('should maintain consistency across different generation methods', () => {
    const seed = 777

    const gen1 = createGenerator(seed)
    const result1 = gen1.words(50)

    const gen2 = createGenerator(seed)
    const result2 = gen2.generate({words: 50})

    expect(result1).toBe(result2)
  })
})
