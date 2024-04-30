package vn.fpt.edu.ctms.configuration;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AzureBlobConfig {
    @Value("${azure.storage.blob.container-name}")
    private String containerName;

    @Value("${azure.storage.blob.connection-string}")
    private String connectionString;

    @Bean
    public BlobServiceClient getBlobServiceClient() {
        return new BlobServiceClientBuilder()
                .connectionString(connectionString).buildClient();

    }

    @Bean
    public BlobContainerClient getBlobContainerClient() {
        return getBlobServiceClient()
                .getBlobContainerClient(containerName);
    }
}
