resource "aws_s3_bucket" "terraform_states" {
  bucket = "terraform-states-wahdan-03"

  tags = {
    Name        = "TerraformStateBucket"
  }
}

resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.terraform_states.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_dynamodb_table" "terraform_locks-2" {
  name         = "terraform-locks-2"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name        = "TerraformLockTable"
  }
}