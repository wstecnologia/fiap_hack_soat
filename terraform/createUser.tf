provider "aws" {
  region = "us-east-1"
}

resource "aws_cognito_user_pool" "main" {
  name                     = "Hackaton-6SOAT"
  alias_attributes         = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = false
    require_uppercase = false
    require_numbers   = false
    require_symbols   = false
  }
}

resource "aws_cognito_user_pool_client" "main" {
  name                                 = "my-hackaton-fiap"
  user_pool_id                         = aws_cognito_user_pool.main.id
  generate_secret                      = false
  explicit_auth_flows                  = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
  //allowed_oauth_flows                  = ["code", "implicit"]
  //allowed_oauth_scopes                 = ["openid", "email", "profile"]
  //allowed_oauth_flows_user_pool_client = true
  //callback_urls                         = ["https://example.com/callback"]
  //logout_urls                           = ["https://example.com/logout"]
}

resource "aws_cognito_identity_pool" "main" {
  identity_pool_name               = "6soat-pool"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id   = aws_cognito_user_pool_client.main.id
    provider_name = aws_cognito_user_pool.main.endpoint
  }
}

output "user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "app_client_id" {
  value = aws_cognito_user_pool_client.main.id
}

output "identity_pool_id" {
  value = aws_cognito_identity_pool.main.id
}
