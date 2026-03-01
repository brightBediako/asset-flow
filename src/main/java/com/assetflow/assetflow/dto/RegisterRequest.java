package com.assetflow.assetflow.dto;

public record RegisterRequest(
        String email,
        String password,
        String fullName,
        Long roleId,
        Long organizationId
) {
}
