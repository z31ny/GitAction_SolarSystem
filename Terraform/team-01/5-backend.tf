#terraform {
#  backend "s3" {
#    bucket         = "terraform-states-wahdann"
#    key            = "terraform.tfstate"
#    region        = "us-east-1"
#    dynamodb_table = "terraform-lockss"
#    encrypt       = true
#  }
#}
