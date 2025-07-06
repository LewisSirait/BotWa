#!/bin/bash

# WhatsApp Gemini Bot - Install Script
# Kompatibel dengan Termux dan Pterodactyl Panel

set -e

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fungsi untuk print dengan warna
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}"
    echo "=========================================="
    echo "   WhatsApp Gemini Bot - Installer"
    echo "=========================================="
    echo -e "${NC}"
}

# Deteksi environment
detect_environment() {
    if [[ "$PREFIX" == *"com.termux"* ]]; then
        ENV_TYPE="termux"
        print_info "Terdeteksi environment: Termux"
    elif [[ -f "/etc/debian_version" ]] || [[ -f "/etc/ubuntu_version" ]]; then
        ENV_TYPE="debian"
        print_info "Terdeteksi environment: Debian/Ubuntu"
    elif [[ -f "/etc/redhat-release" ]]; then
        ENV_TYPE="redhat"
        print_info "Terdeteksi environment: Red Hat/CentOS"
    else
        ENV_TYPE="unknown"
        print_warning "Environment tidak dikenal, menggunakan perintah standar"
    fi
}

# Install dependencies berdasarkan environment
install_system_deps() {
    print_info "Menginstall system dependencies..."
    
    case $ENV_TYPE in
        "termux")
            # Termux packages
            print_info "Updating package lists..."
            pkg update -y
            pkg upgrade -y
            
            print_info "Installing required packages..."
            pkg install -y nodejs npm git curl wget
            pkg install -y chromium
            
            # Install additional packages untuk Puppeteer
            pkg install -y libx11 libxcomposite libxdamage libxrandr libxtst libxss libnss
            ;;
        "debian")
            # Debian/Ubuntu packages
            print_info "Updating package lists..."
            sudo apt update -y
            
            print_info "Installing required packages..."
            sudo apt install -y curl wget git
            
            # Install Node.js jika belum ada
            if ! command -v node &> /dev/null; then
                print_info "Installing Node.js..."
                curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                sudo apt install -y nodejs
            fi
            
            # Install dependencies untuk Puppeteer
            sudo apt install -y \
                ca-certificates \
                fonts-liberation \
                libappindicator3-1 \
                libasound2 \
                libatk-bridge2.0-0 \
                libatk1.0-0 \
                libc6 \
                libcairo2 \
                libcups2 \
                libdbus-1-3 \
                libexpat1 \
                libfontconfig1 \
                libgbm1 \
                libgcc1 \
                libglib2.0-0 \
                libgtk-3-0 \
                libnspr4 \
                libnss3 \
                libpango-1.0-0 \
                libpangocairo-1.0-0 \
                libstdc++6 \
                libx11-6 \
                libx11-xcb1 \
                libxcb1 \
                libxcomposite1 \
                libxcursor1 \
                libxdamage1 \
                libxext6 \
                libxfixes3 \
                libxi6 \
                libxrandr2 \
                libxrender1 \
                libxss1 \
                libxtst6 \
                lsb-release \
                wget \
                xdg-utils
            ;;
        "redhat")
            # Red Hat/CentOS packages
            print_info "Updating package lists..."
            sudo yum update -y
            
            print_info "Installing required packages..."
            sudo yum install -y curl wget git
            
            # Install Node.js jika belum ada
            if ! command -v node &> /dev/null; then
                print_info "Installing Node.js..."
                curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
                sudo yum install -y nodejs
            fi
            ;;
        *)
            print_warning "Environment tidak dikenal, pastikan Node.js dan npm sudah terinstall"
            ;;
    esac
}

# Cek versi Node.js
check_node_version() {
    print_info "Checking Node.js version..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js version: $NODE_VERSION"
        
        # Cek minimal versi Node.js (v14+)
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -lt 14 ]; then
            print_error "Node.js version harus minimal v14.0.0"
            exit 1
        fi
    else
        print_error "Node.js tidak terinstall!"
        exit 1
    fi
    
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm version: $NPM_VERSION"
    else
        print_error "npm tidak terinstall!"
        exit 1
    fi
}

# Install Node.js dependencies
install_node_deps() {
    print_info "Installing Node.js dependencies..."
    
    # Hapus node_modules dan package-lock.json jika ada
    if [ -d "node_modules" ]; then
        print_info "Removing existing node_modules..."
        rm -rf node_modules
    fi
    
    if [ -f "package-lock.json" ]; then
        print_info "Removing existing package-lock.json..."
        rm -f package-lock.json
    fi
    
    # Install dependencies
    print_info "Running npm install..."
    npm install --no-audit --no-fund
    
    print_success "Node.js dependencies installed successfully!"
}

# Setup file permissions
setup_permissions() {
    print_info "Setting up file permissions..."
    
    # Buat executable untuk script
    chmod +x install.sh
    
    # Buat folder sessions jika belum ada
    if [ ! -d "sessions" ]; then
        mkdir -p sessions
        print_info "Created sessions directory"
    fi
    
    # Set permissions untuk folder sessions
    chmod 755 sessions
    
    print_success "File permissions set successfully!"
}

# Test installation
test_installation() {
    print_info "Testing installation..."
    
    # Cek apakah file utama ada
    if [ ! -f "index.js" ]; then
        print_error "File index.js tidak ditemukan!"
        exit 1
    fi
    
    if [ ! -f "gemini.js" ]; then
        print_error "File gemini.js tidak ditemukan!"
        exit 1
    fi
    
    # Test syntax JavaScript
    print_info "Testing JavaScript syntax..."
    node -c index.js
    node -c gemini.js
    
    print_success "Installation test passed!"
}

# Main installation process
main() {
    print_header
    
    print_info "Starting installation process..."
    
    # Detect environment
    detect_environment
    
    # Install system dependencies
    install_system_deps
    
    # Check Node.js version
    check_node_version
    
    # Install Node.js dependencies
    install_node_deps
    
    # Setup permissions
    setup_permissions
    
    # Test installation
    test_installation
    
    print_success "Installation completed successfully!"
    echo ""
    print_info "Next steps:"
    echo "1. Edit index.js dan ganti YOUR_GEMINI_API_KEY dengan API key Anda"
    echo "2. Jalankan bot dengan: node index.js"
    echo "3. Scan QR code atau masukkan pairing code ke WhatsApp"
    echo ""
    print_warning "PENTING: Pastikan Anda memiliki API Key Google Gemini!"
    print_info "Dapatkan API Key di: https://makersuite.google.com/app/apikey"
    echo ""
    
    # Tanyakan apakah user ingin menjalankan bot sekarang
    read -p "Apakah Anda ingin menjalankan bot sekarang? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if grep -q "YOUR_GEMINI_API_KEY" index.js; then
            print_warning "API Key belum diisi! Edit index.js terlebih dahulu."
        else
            print_info "Starting WhatsApp Gemini Bot..."
            node index.js
        fi
    fi
}

# Run main function
main "$@"
