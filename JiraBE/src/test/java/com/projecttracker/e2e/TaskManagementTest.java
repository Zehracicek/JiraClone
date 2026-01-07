package com.projecttracker.e2e;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class TaskManagementTest extends BaseTest {
    @Test
    @DisplayName("Hızlı Görev Oluşturma Senaryosu")
    void testQuickTaskCreation() {
        loginAsAdmin();
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Hızlı Oluştur')]"))).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='Neler yapılması gerekiyor?']"))).sendKeys("Jenkins Otomatik Task" + System.currentTimeMillis());
        driver.findElement(By.xpath("//textarea[@placeholder='Görev detaylarını buraya yazın...']")).sendKeys("Bu görev Jenkins pipeline tarafından oluşturuldu.");

        driver.findElement(By.xpath("//button[contains(text(), 'Görevi Oluştur')]")).click();

        WebElement task = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//p[contains(text(), 'Jenkins Otomatik')]")));
        Assertions.assertTrue(task.isDisplayed());
    }
}