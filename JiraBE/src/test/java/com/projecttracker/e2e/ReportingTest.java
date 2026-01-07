package com.projecttracker.e2e;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class ReportingTest extends BaseTest {
    @Test
    @DisplayName("Raporlar Sayfası Veri Doğrulama")
    void testReportsData() {
        loginAsUser();
        driver.findElement(By.xpath("//span[contains(text(), 'Raporlar')]")).click();

        // Rapor tablolarının yüklendiğini kontrol et
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h1[contains(text(), 'Sprint Performans Raporu')]")));

        WebElement performanceTable = driver.findElement(By.tagName("table"));
        Assertions.assertTrue(performanceTable.isDisplayed());

        // Ekip iş yükü tablosunu kontrol et
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h1[contains(text(), 'Ekip İş Yükü Karşılaştırması')]")));
    }
}
