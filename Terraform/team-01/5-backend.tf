terraform {
  backend "s3" {
    bucket         = "stagebucket12"
    key            = "stage-eks1/terraform.tfstate"
    region         = "us-west-2"
    dynamodb_table = "terraform-lock"
    encrypt        = true
  }
}

