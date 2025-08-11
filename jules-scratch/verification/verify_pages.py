from playwright.sync_api import sync_playwright, TimeoutError
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    email = "test-user-jules-5@example.com" # Using a new email to be safe
    password = "password"

    try:
        page.goto("http://127.0.0.1:3000/auth")

        # Switch to the registration tab
        page.get_by_role("tab", name="إنشاء حساب").click()

        # Get the registration form, which is the active tab content
        register_form = page.locator('div[data-state="active"]')

        # Fill out the registration form
        register_form.get_by_label("الاسم الكامل").fill("Jules Test")
        register_form.get_by_label("البريد الإلكتروني").fill(email)
        page.locator("#signup-password").fill(password)
        page.locator("#signup-confirm-password").fill(password)
        register_form.get_by_role("button", name="إنشاء الحساب").click()

        # Wait for a bit and take a screenshot
        time.sleep(5)
        page.screenshot(path="jules-scratch/verification/after-signup.png")

        # Login
        page.get_by_role("tab", name="تسجيل الدخول").click()
        login_form = page.locator('div[data-state="active"]')
        login_form.get_by_label("البريد الإلكتروني").fill(email)
        page.locator("#login-password").fill(password)
        login_form.get_by_role("button", name="تسجيل الدخول").click()
        page.wait_for_url("http://127.0.0.1:3000/dashboard", timeout=15000)

        # Navigate to Players page and take screenshot
        page.get_by_role("link", name="عرض اللاعبين").click()
        page.wait_for_url("http://127.0.0.1:3000/players")
        page.screenshot(path="jules-scratch/verification/players-page.png")

        # Navigate to Reports page and take screenshot
        page.goto("http://127.0.0.1:3000/dashboard")
        page.get_by_role("link", name="إدارة التقارير").click()
        page.wait_for_url("http://127.0.0.1:3000/reports")
        page.screenshot(path="jules-scratch/verification/reports-page.png")

        # Navigate to Statistics page and take screenshot
        page.goto("http://127.0.0.1:3000/dashboard")
        page.get_by_role("link", name="عرض الإحصائيات").click()
        page.wait_for_url("http://1.2.3.4:3000/statistics")
        page.screenshot(path="jules-scratch/verification/statistics-page.png")

    except TimeoutError as e:
        page.screenshot(path="jules-scratch/verification/login-failure.png")
        print(f"Script failed with timeout: {e}")
        print("Screenshot saved to jules-scratch/verification/login-failure.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
