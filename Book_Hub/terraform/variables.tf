variable "resource_group_name" {
  default = "bookhub-rg"
}

variable "location" {
  default = "East US"
}

variable "acr_name" {
  default = "bookhubacr123" # must be unique globally
}

variable "app_service_plan" {
  default = "bookhub-service-plan"
}

variable "web_app_name" {
  default = "bookhub-container-app"
}
