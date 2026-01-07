package com.projecttracker.e2e;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class ProfileLogoutTest extends BaseTest {
    @Test
    @DisplayName("Oturumu Kapatma Senaryosu")
    void testLogout() {
        loginAsAdmin();

        // Profil menüsünü aç
        driver.findElement(By.xpath("//button[contains(@class, 'flex items-center gap-2')]")).click();

        // Çıkış yap butonuna tıkla
        WebElement logoutBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Oturumu Kapat')]")));
        logoutBtn.click();

        // Login sayfasına döndüğünü doğrula
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h1[contains(text(), 'JiraPro')]")));
        Assertions.assertTrue(driver.getCurrentUrl().contains("/login"));
    }
}
