package com.projecttracker.e2e;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class SprintCreationTest extends BaseTest {
    @Test
    @DisplayName("Yeni Sprint Oluşturma Senaryosu")
    void testCreateNewSprint() {
        loginAsAdmin();

        safeClick(By.xpath("//span[contains(text(), 'Projeler')]"));

        safeClick(By.xpath("//button[contains(., 'Yeni Sprint Oluştur')]"));

        WebElement nameInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='Örn: Innovation Sprint Q4']")));
        nameInput.sendKeys("Jenkins CI Sprint : " + System.currentTimeMillis() );

        driver.findElement(By.xpath("//textarea[@placeholder='Bu sprintte neyi başarmayı hedefliyoruz?']"))
                .sendKeys("Otomasyon testi başarısı.");

        safeClick(By.xpath("//button[contains(.,'Sprinti Başlat')]"));
        handleAlertIfExists();

        WebElement sprintCard = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h3[contains(text(), 'Jenkins CI Sprint')]")));
        Assertions.assertNotNull(sprintCard);

    }
}