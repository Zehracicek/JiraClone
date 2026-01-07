package com.projecttracker.e2e;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class AdminLoginTest extends BaseTest {
    @Test
    @DisplayName("Başarılı Giriş Senaryosu")
    void testSuccessfulLogin() {
        loginAsAdmin();
        Assertions.assertTrue(driver.getCurrentUrl().contains("/#/"), "Login sonrası Dashboard yüklenmedi.");
    }
}