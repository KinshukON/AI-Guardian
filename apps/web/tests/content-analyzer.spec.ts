import { test, expect } from '@playwright/test'

test.describe('Content Analyzer Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the content analyzer page
    await page.goto('/analyze')
  })

  test('should analyze content and display results', async ({ page }) => {
    // Test URL analysis
    await test.step('analyze URL content', async () => {
      // Select URL input type
      await page.click('button:has-text("URL")')
      
      // Input a test URL
      await page.fill('textarea[placeholder*="YouTube"]', 'https://youtube.com/watch?v=science_experiment')
      
      // Click analyze button
      await page.click('button:has-text("Analyze Content")')
      
      // Wait for analysis to complete
      await expect(page.locator('text=Analyzing...')).toBeVisible()
      await expect(page.locator('text=Analyzing...')).not.toBeVisible({ timeout: 10000 })
      
      // Verify results are displayed
      await expect(page.locator('text=Safety Score')).toBeVisible()
      await expect(page.locator('text=Learning Quality')).toBeVisible()
      await expect(page.locator('text=Bias Detection')).toBeVisible()
    })

    // Test text analysis
    await test.step('analyze text content', async () => {
      // Select text input type
      await page.click('button:has-text("Text")')
      
      // Input test text
      await page.fill('textarea[placeholder*="content"]', 'This is a sample educational text about science and learning.')
      
      // Click analyze button
      await page.click('button:has-text("Analyze Content")')
      
      // Wait for analysis to complete
      await expect(page.locator('text=Analyzing...')).toBeVisible()
      await expect(page.locator('text=Analyzing...')).not.toBeVisible({ timeout: 10000 })
      
      // Verify results
      await expect(page.locator('text=Recommendations')).toBeVisible()
    })

    // Test chat analysis
    await test.step('analyze chat content', async () => {
      // Select chat input type
      await page.click('button:has-text("Chat")')
      
      // Input test chat
      await page.fill('textarea[placeholder*="chat"]', 'User: Can you help me with math homework?\nBot: Sure! What grade are you in?\nUser: 5th grade\nBot: Great! I can help with 5th grade math.')
      
      // Click analyze button
      await page.click('button:has-text("Analyze Content")')
      
      // Wait for analysis to complete
      await expect(page.locator('text=Analyzing...')).toBeVisible()
      await expect(page.locator('text=Analyzing...')).not.toBeVisible({ timeout: 10000 })
      
      // Verify results
      await expect(page.locator('text=Safety Analysis')).toBeVisible()
    })
  })

  test('should display safety badges correctly', async ({ page }) => {
    // Analyze some content first
    await page.click('button:has-text("Text")')
    await page.fill('textarea[placeholder*="content"]', 'Educational content about science.')
    await page.click('button:has-text("Analyze Content")')
    
    // Wait for results
    await expect(page.locator('text=Analyzing...')).not.toBeVisible({ timeout: 10000 })
    
    // Check that safety badges are displayed
    await expect(page.locator('[data-testid="safety-badge"]')).toBeVisible()
  })

  test('should show age-appropriate recommendations', async ({ page }) => {
    // Analyze content
    await page.click('button:has-text("Text")')
    await page.fill('textarea[placeholder*="content"]', 'Complex scientific content with advanced concepts.')
    await page.click('button:has-text("Analyze Content")')
    
    // Wait for results
    await expect(page.locator('text=Analyzing...')).not.toBeVisible({ timeout: 10000 })
    
    // Verify recommendations are shown
    await expect(page.locator('text=Recommendations')).toBeVisible()
    await expect(page.locator('text=Next Steps')).toBeVisible()
  })

  test('should handle explain like I\'m 12 toggle', async ({ page }) => {
    // Analyze content first
    await page.click('button:has-text("Text")')
    await page.fill('textarea[placeholder*="content"]', 'Educational content.')
    await page.click('button:has-text("Analyze Content")')
    
    // Wait for results
    await expect(page.locator('text=Analyzing...')).not.toBeVisible({ timeout: 10000 })
    
    // Test the explain like I'm 12 toggle
    await page.click('button:has-text("Explain Like I\'m 12")')
    
    // Verify toggle state changes
    await expect(page.locator('button:has-text("Show Regular Explanation")')).toBeVisible()
  })
}) 