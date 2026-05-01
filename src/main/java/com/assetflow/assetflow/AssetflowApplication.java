package com.assetflow.assetflow;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AssetflowApplication {

	public static void main(String[] args) {
		loadEnvFile();
		SpringApplication.run(AssetflowApplication.class, args);
	}

	/**
	 * Loads root {@code .env} into system properties when keys are not already set in the OS environment.
	 * Does not override real environment variables.
	 */
	private static void loadEnvFile() {
		Dotenv dotenv = Dotenv.configure()
				.directory(System.getProperty("user.dir"))
				.ignoreIfMissing()
				.load();
		dotenv.entries().forEach(e -> {
			String key = e.getKey();
			if (System.getenv(key) == null && System.getProperty(key) == null) {
				System.setProperty(key, e.getValue());
			}
		});
	}

}
