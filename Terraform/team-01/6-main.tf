terraform {
  backend "s3" {
    bucket         = "bm-devops-state-bucket1"
    key            = "terraform.tfstate"
    region         = "eu-north-1"
    dynamodb_table = "terraform-lock-table"
    encrypt        = true
  }
}
module "vpc" {
  source = "../infrastructure-modules/vpc"

  environment      = "dev"
  project         = "sprints"
  private-subnets = ["10.0.128.0/20", "10.0.144.0/20"]
  public-subnets  = ["10.0.0.0/20", "10.0.16.0/20"]
  azs             = ["eu-north-1a", "eu-north-1b"]
}

module "eks" {
  source          = "../infrastructure-modules/eks"

  cluster_name    = "GPA-cluster"
  cluster_version = "1.33"
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.private_subnet_ids
  node_groups    = var.node_groups
  depends_on     = [module.vpc]
}
