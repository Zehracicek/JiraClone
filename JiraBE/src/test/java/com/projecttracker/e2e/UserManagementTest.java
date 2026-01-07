package com.projecttracker.e2e;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class UserManagementTest extends BaseTest {
    @Test
    @DisplayName("Ekibe Yeni Üye Ekleme Senaryosu")
    void testAddNewTeamMember() {
        loginAsAdmin();
        driver.findElement(By.xpath("//span[contains(text(), 'Ekip Üyeleri')]")).click();

        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Yeni Üye Ekle')]"))).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='Ahmet Yılmaz']"))).sendKeys("Test Robotu:" + System.currentTimeMillis());
        driver.findElement(By.xpath("//input[@placeholder='ahmtylmz']")).sendKeys("robotuser:" + System.currentTimeMillis());
        driver.findElement(By.xpath("//input[@placeholder='ahmet@sirket.com']")).sendKeys("robot"+System.currentTimeMillis()+"@test.com" );
        driver.findElement(By.xpath("//input[@placeholder='••••••••']")).sendKeys("test123456");

        driver.findElement(By.xpath("//button[contains(text(), 'Üyeyi Kaydet')]")).click();

        WebElement userCard = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h3[contains(text(), 'Test Robotu')]")));
        Assertions.assertTrue(userCard.isDisplayed());
    }
}