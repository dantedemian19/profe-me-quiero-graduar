package com.profe_me_quiero_graduar.app;

import com.profe_me_quiero_graduar.app.ProfeMeQuieroGraduarApp;
import com.profe_me_quiero_graduar.app.ReactiveSqlTestContainerExtension;
import com.profe_me_quiero_graduar.app.config.TestSecurityConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { ProfeMeQuieroGraduarApp.class, TestSecurityConfiguration.class })
@ExtendWith(ReactiveSqlTestContainerExtension.class)
public @interface IntegrationTest {
}
