import { test, expect } from '@playwright/test'

test.describe('KidGPT to Report Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the KidGPT page
    await page.goto('/kidgpt')
  })

  test('should interact with KidGPT and generate responses', async ({ page }) => {
    // Test different modes
    await test.step('test homework mode', async () => {
      // Select homework mode
      await page.click('button:has-text("Homework Tutor")')
      
      // Type a question
      await page.fill('textarea[placeholder*="homework"]', 'Can you help me understand fractions?')
      
      // Send message
      await page.click('button:has-text("Send")')
      
      // Wait for response
      await expect(page.locator('text=AI Guardian mentor')).toBeVisible({ timeout: 10000 })
      
      // Verify response contains helpful content
      await expect(page.locator('text=fractions')).toBeVisible()
    })

    await test.step('test curiosity mode', async () => {
      // Select curiosity mode
      await page.click('button:has-text("Curiosity")')
      
      // Type a question
      await page.fill('textarea[placeholder*="curiosity"]', 'Why is the sky blue?')
      
      // Send message
      await page.click('button:has-text("Send")')
      
      // Wait for response
      await expect(page.locator('text=AI Guardian mentor')).toBeVisible({ timeout: 10000 })
      
      // Verify response contains scientific explanation
      await expect(page.locator('text=sky')).toBeVisible()
    })

    await test.step('test explain like I\'m 12 toggle', async () => {
      // Toggle the explain like I'm 12 switch
      await page.click('button[role="switch"]')
      
      // Verify toggle state changes
      await expect(page.locator('button:has-text("Explain Like I\'m 12")')).toBeVisible()
      
      // Toggle back
      await page.click('button[role="switch"]')
      await expect(page.locator('button:has-text("Regular")')).toBeVisible()
    })
  })

  test('should display citations and safety information', async ({ page }) => {
    // Ask a question to get a response
    await page.click('button:has-text("Homework Tutor")')
    await page.fill('textarea[placeholder*="homework"]', 'What is photosynthesis?')
    await page.click('button:has-text("Send")')
    
    // Wait for response
    await expect(page.locator('text=AI Guardian mentor')).toBeVisible({ timeout: 10000 })
    
    // Check for citations
    await expect(page.locator('text=Sources:')).toBeVisible()
    
    // Check for safety note
    await expect(page.locator('text=Your AI Guardian')).toBeVisible()
  })

  test('should navigate to reports and generate weekly report', async ({ page }) => {
    // Navigate to reports page
    await page.goto('/reports')
    
    // Verify reports page loads
    await expect(page.locator('text=Reports & Insights')).toBeVisible()
    
    // Test report generation
    await test.step('generate weekly report', async () => {
      // Select weekly report
      await page.selectOption('select', 'weekly')
      
      // Click generate report button
      await page.click('button:has-text("Generate New Report")')
      
      // Wait for generation to start
      await expect(page.locator('text=Generating...')).toBeVisible()
      
      // Wait for generation to complete (mock)
      await expect(page.locator('text=Generating...')).not.toBeVisible({ timeout: 10000 })
    })
  })

  test('should display dashboard with insights', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard')
    
    // Verify dashboard loads
    await expect(page.locator('text=Guardian Dashboard')).toBeVisible()
    
    // Check for stats
    await expect(page.locator('text=Content Analyzed')).toBeVisible()
    await expect(page.locator('text=Safety Alerts')).toBeVisible()
    await expect(page.locator('text=Learning Time')).toBeVisible()
    await expect(page.locator('text=Screen Time')).toBeVisible()
    
    // Check for quick actions
    await expect(page.locator('text=Quick Actions')).toBeVisible()
    
    // Check for recent activity
    await expect(page.locator('text=Recent Content Analysis')).toBeVisible()
    
    // Check for trends
    await expect(page.locator('text=Weekly Trends & Insights')).toBeVisible()
  })

  test('should handle child profile switching', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard')
    
    // Check child selector is present
    await expect(page.locator('text=Active Child:')).toBeVisible()
    
    // Verify child options are available
    const childSelector = page.locator('select')
    await expect(childSelector).toBeVisible()
    
    // Check that multiple children are available
    const options = await childSelector.locator('option').all()
    expect(options.length).toBeGreaterThan(1)
  })

  test('should generate and download report', async ({ page }) => {
    // Navigate to reports page
    await page.goto('/reports')
    
    // Look for existing reports
    await expect(page.locator('text=Recent Reports')).toBeVisible()
    
    // Check for download buttons on existing reports
    const downloadButtons = page.locator('button:has-text("Download PDF")')
    if (await downloadButtons.count() > 0) {
      // Verify download button is clickable
      await expect(downloadButtons.first()).toBeEnabled()
    }
    
    // Test report generation workflow
    await page.click('button:has-text("Generate New Report")')
    
    // Wait for generation
    await expect(page.locator('text=Generating...')).toBeVisible()
    await expect(page.locator('text=Generating...')).not.toBeVisible({ timeout: 10000 })
    
    // Verify report was generated
    await expect(page.locator('text=Weekly Report')).toBeVisible()
  })
}) 