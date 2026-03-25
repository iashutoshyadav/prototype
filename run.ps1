# Step 1: Run Rust adversarial tests and generate JSON report
cd ..
cargo test -p mofa-testing adversarial -- -Z unstable-options --format json > prototype/public/test_report.json

# Step 2: Start React frontend
cd prototype
npm run dev
