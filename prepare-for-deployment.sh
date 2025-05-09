#!/bin/bash

# GodivaTech Deployment Preparation Script
# This script helps prepare your project for deployment to Vercel and Render

# Text colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}GodivaTech Deployment Preparation Script${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Function to check if .env file exists and create if not
check_env_file() {
  if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}Created .env file. Please edit it with your actual values before deploying.${NC}"
  else
    echo -e "${GREEN}.env file already exists.${NC}"
  fi
}

# Function to ensure build scripts are executable
ensure_executable() {
  echo -e "${BLUE}Making build scripts executable...${NC}"
  chmod +x vercel-build.sh
  chmod +x render-build.sh
  chmod +x render-start.sh
  chmod +x vercel-start.sh
  echo -e "${GREEN}Build scripts are now executable.${NC}"
}

# Function to check Firebase configuration
check_firebase() {
  echo -e "${BLUE}Checking Firebase configuration...${NC}"
  if grep -q "VITE_FIREBASE_API_KEY=your_firebase_api_key" .env; then
    echo -e "${RED}Warning: You need to update Firebase configuration in .env file before deploying.${NC}"
  else
    echo -e "${GREEN}Firebase configuration appears to be set.${NC}"
  fi
}

# Function to check Cloudinary configuration
check_cloudinary() {
  echo -e "${BLUE}Checking Cloudinary configuration...${NC}"
  if grep -q "CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name" .env; then
    echo -e "${RED}Warning: You need to update Cloudinary configuration in .env file before deploying.${NC}"
  else
    echo -e "${GREEN}Cloudinary configuration appears to be set.${NC}"
  fi
}

# Function to test build locally
test_build() {
  echo -e "${BLUE}Would you like to test the build process locally? (y/n)${NC}"
  read -r response
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${BLUE}Running build process...${NC}"
    npm run build
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Build completed successfully.${NC}"
    else
      echo -e "${RED}Build failed. Please fix the errors before deploying.${NC}"
      exit 1
    fi
  else
    echo -e "${BLUE}Skipping local build test.${NC}"
  fi
}

# Function to select deployment target
select_deployment() {
  echo -e "${BLUE}Which deployment option would you like to prepare for?${NC}"
  echo "1) Full-stack deployment on Vercel"
  echo "2) Split deployment (Frontend on Vercel, Backend on Render)"
  echo "3) Both options"
  read -r choice
  
  case $choice in
    1)
      echo -e "${BLUE}Preparing for full-stack deployment on Vercel...${NC}"
      # No special action needed for this option
      ;;
    2)
      echo -e "${BLUE}Preparing for split deployment...${NC}"
      # Ask for Render backend URL
      echo -e "${BLUE}Please enter your Render backend URL (e.g., https://godivatech-backend.onrender.com):${NC}"
      read -r backend_url
      if [ -n "$backend_url" ]; then
        # Update the .env file with the backend URL
        sed -i.bak "s#VITE_API_URL=/api#VITE_API_URL=${backend_url}/api#g" .env
        echo -e "${GREEN}Updated VITE_API_URL in .env file.${NC}"
      fi
      ;;
    3)
      echo -e "${BLUE}Preparing for both deployment options...${NC}"
      # No special action needed
      ;;
    *)
      echo -e "${RED}Invalid choice. Exiting.${NC}"
      exit 1
      ;;
  esac
}

# Main script execution
check_env_file
ensure_executable
check_firebase
check_cloudinary
select_deployment
test_build

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}Project is prepared for deployment!${NC}"
echo -e "${BLUE}Follow the steps in UPDATED_DEPLOYMENT_GUIDE.md${NC}"
echo -e "${BLUE}and DEPLOYMENT_CHECKLIST.md to complete deployment.${NC}"
echo -e "${BLUE}=========================================${NC}"