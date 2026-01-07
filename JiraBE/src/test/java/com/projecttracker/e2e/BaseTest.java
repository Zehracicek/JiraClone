package com.projecttracker.e2e;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.junit.jupiter.api.*;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;

public class BaseTest {
    protected WebDriver driver;
    protected WebDriverWait wait;

    protected String BASE_URL;
    protected String SELENIUM_REMOTE_URL;

    @BeforeEach
    void setup() throws Exception {
        BASE_URL = System.getenv().getOrDefault("BASE_URL", "http://projecttracker-frontend");
        SELENIUM_REMOTE_URL = System.getenv().getOrDefault("SELENIUM_REMOTE_URL", "http://localhost:4444");

        ChromeOptions options = new ChromeOptions();
        options.addArguments(
                //"--headless=new",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--window-size=1920,1080",
                "--disable-extensions",
                "--disable-setuid-sandbox"
        );

        try {
            driver = new RemoteWebDriver(new URL(SELENIUM_REMOTE_URL), options);
            wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        } catch (Exception e) {
            throw new RuntimeException("Failed to start Selenium WebDriver at: " + SELENIUM_REMOTE_URL, e);
        }
    }

    @AfterEach
    void tearDown() {
        try {
            Thread.sleep(5000);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (driver != null) driver.quit();
    }

    protected void loginAsAdmin() {
        driver.get(BASE_URL + "/#/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='Kullanıcı Adı']"))).sendKeys("admin");
        driver.findElement(By.xpath("//input[@placeholder='••••••••']")).sendKeys("123456");
        driver.findElement(By.xpath("//button[contains(text(), 'Giriş Yap')]")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h1[contains(text(), 'Kişisel Özet')]")));
    }

    protected void loginAsUser() {
        driver.get(BASE_URL + "/#/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='Kullanıcı Adı']"))).sendKeys("robotuser");
        driver.findElement(By.xpath("//input[@placeholder='••••••••']")).sendKeys("test123456");
        driver.findElement(By.xpath("//button[contains(text(), 'Giriş Yap')]")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h1[contains(text(), 'Kişisel Özet')]")));
    }

    public void safeClick(By locator) {
        WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(locator));
        wait.until(ExpectedConditions.elementToBeClickable(element));

        ((JavascriptExecutor) driver)
                .executeScript("arguments[0].scrollIntoView({block:'center'});", element);

        ((JavascriptExecutor) driver)
                .executeScript("arguments[0].click();", element);
    }

    public void handleAlertIfExists() {
        try {
            Alert alert = wait.until(ExpectedConditions.alertIsPresent());
            System.out.println("ALERT: " + alert.getText());
            alert.accept();
        } catch (TimeoutException ignored) {
        }
    }


}
