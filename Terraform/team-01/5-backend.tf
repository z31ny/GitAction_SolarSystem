#terraform {
#  backend "s3" {
#    bucket         = "terraform-states-wahdan-03"
#    key            = "terraform.tfstate"
#    region        = "us-east-1"
#    dynamodb_table = "terraform-locks-2"
#    encrypt       = true
#  }
#}
