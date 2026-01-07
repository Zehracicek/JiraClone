package com.projecttracker.e2e;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;

public class KanbanBoardTest extends BaseTest {

    @Test
    @DisplayName("Board Üzerinde Görev Oluşturma ve Görüntüleme")
    void testBoardTaskCreateAndView() {

        loginAsUser();

        String loggedInFullName = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//span[contains(@class,'font-bold') and contains(@class,'text-slate-700')]")
                )
        ).getText();

        WebElement boardNav = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//span[contains(text(), 'İş Takip Panosu')]")
        ));
        boardNav.click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h3[normalize-space()='Yapılacaklar']")
        ));

        WebElement addTaskBtn = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(@class,'bg-blue-600') and contains(.,'Görev Ekle')]")
        ));

        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({block:'center'});", addTaskBtn
        );
        addTaskBtn.click();

        WebElement modalTitle = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h2[normalize-space()='Yeni Görev Oluştur']")
        ));

        WebElement modal = modalTitle.findElement(
                By.xpath("ancestor::div[contains(@class,'bg-white') and contains(@class,'rounded-3xl')]")
        );

        // 6. Formu doldur
        String taskTitle = "Selenium Otomasyon Görevi " + System.currentTimeMillis();

        WebElement titleInput = modal.findElement(By.xpath(".//input[@type='text']"));
        titleInput.sendKeys(taskTitle);

        WebElement descInput = modal.findElement(By.xpath(".//textarea"));
        descInput.sendKeys("Bu görev Selenium test senaryosu tarafından otomatik olarak oluşturulmuştur.");

        // Öncelik
        Select prioritySelect = new Select(
                modal.findElement(By.xpath(".//label[contains(text(),'Öncelik')]/following-sibling::select"))
        );
        prioritySelect.selectByValue("HIGH");

        // Sorumlu
        Select assigneeSelect = new Select(
                modal.findElement(By.xpath(".//label[contains(text(),'Sorumlu')]/following-sibling::select"))
        );

        assigneeSelect.selectByVisibleText(loggedInFullName);

        WebElement sprintSelect = driver.findElement(
                By.xpath("//label[contains(text(),'Sprint')]/following-sibling::select")
        );

        Select select = new Select(sprintSelect);

        select.selectByIndex(1);

        WebElement submitBtn = modal.findElement(
                By.xpath(".//button[@type='submit' and contains(.,'Görevi Oluştur')]")
        );

        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({block:'center'});", submitBtn
        );
        submitBtn.click();

        wait.until(ExpectedConditions.invisibilityOf(modalTitle));

        WebElement todoColumn = driver.findElement(
                By.xpath("//h3[normalize-space()='Yapılacaklar']/ancestor::div[contains(@class,'flex-col')]")
        );

        WebElement newTaskCard = wait.until(
                ExpectedConditions.visibilityOf(
                        todoColumn.findElement(
                                By.xpath(".//h4[normalize-space()='" + taskTitle + "']")
                        )
                )
        );

        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({block:'center'});", newTaskCard
        );
        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].click();", newTaskCard
        );


    }
}
