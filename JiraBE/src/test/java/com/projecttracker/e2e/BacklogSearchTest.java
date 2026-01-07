package com.projecttracker.e2e;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class BacklogSearchTest extends BaseTest {
    @Test
    @DisplayName("Global Arama ve Filtreleme Senaryosu")
    void testBacklogSearch() {
        loginAsAdmin();

        WebElement searchInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//input[@placeholder='Görev veya anahtar kelime ara...']")
                )
        );
        searchInput.sendKeys("Design");

        WebElement filterBadge = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//span[contains(normalize-space(.), 'filtrelendi')]")
                )
        );

        Assertions.assertTrue(filterBadge.isDisplayed(),
                "Filtre uygulandığı bilgisi ekranda görünmüyor");
    }
}
