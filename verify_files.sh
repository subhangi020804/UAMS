#!/bin/bash

echo "🔍 GLP Archive System - File Verification Script"
echo "=================================================="
echo ""

echo "📋 Checking required files..."
echo ""

# Check App.tsx
if [ -f "src/app/App.tsx" ]; then
    echo "✅ App.tsx exists"
    if grep -q "CompliancePage" "src/app/App.tsx"; then
        echo "   ✅ CompliancePage imported"
    else
        echo "   ❌ CompliancePage NOT imported!"
    fi
    if grep -q "/compliance" "src/app/App.tsx"; then
        echo "   ✅ /compliance route exists"
    else
        echo "   ❌ /compliance route MISSING!"
    fi
else
    echo "❌ App.tsx NOT FOUND!"
fi

echo ""

# Check Navigation.tsx
if [ -f "src/app/components/Navigation.tsx" ]; then
    echo "✅ Navigation.tsx exists"
    if grep -q "compliance" "src/app/components/Navigation.tsx"; then
        echo "   ✅ Compliance link exists"
    else
        echo "   ❌ Compliance link MISSING!"
    fi
else
    echo "❌ Navigation.tsx NOT FOUND!"
fi

echo ""

# Check CompliancePage.tsx
if [ -f "src/app/components/CompliancePage.tsx" ]; then
    lines=$(wc -l < "src/app/components/CompliancePage.tsx")
    echo "✅ CompliancePage.tsx exists ($lines lines)"
    if [ "$lines" -eq 713 ]; then
        echo "   ✅ Correct line count (713)"
    else
        echo "   ⚠️  Line count is $lines (expected 713)"
    fi
else
    echo "❌ CompliancePage.tsx NOT FOUND!"
fi

echo ""

# Check DashboardPage.tsx
if [ -f "src/app/components/DashboardPage.tsx" ]; then
    lines=$(wc -l < "src/app/components/DashboardPage.tsx")
    echo "✅ DashboardPage.tsx exists ($lines lines)"
    if [ "$lines" -eq 402 ]; then
        echo "   ✅ Correct line count (402)"
    else
        echo "   ⚠️  Line count is $lines (expected 402)"
    fi
else
    echo "❌ DashboardPage.tsx NOT FOUND!"
fi

echo ""

# Check storage.ts
if [ -f "src/app/utils/storage.ts" ]; then
    lines=$(wc -l < "src/app/utils/storage.ts")
    echo "✅ storage.ts exists ($lines lines)"
    if grep -q "getMonthlyUploadStats" "src/app/utils/storage.ts"; then
        echo "   ✅ getMonthlyUploadStats function exists"
    else
        echo "   ❌ getMonthlyUploadStats function MISSING!"
    fi
else
    echo "❌ storage.ts NOT FOUND!"
fi

echo ""
echo "=================================================="
echo "📦 Checking package.json dependencies..."
echo ""

if [ -f "package.json" ]; then
    if grep -q "\"motion\"" "package.json"; then
        echo "✅ motion package listed"
    else
        echo "❌ motion package MISSING!"
    fi
    
    if grep -q "\"recharts\"" "package.json"; then
        echo "✅ recharts package listed"
    else
        echo "❌ recharts package MISSING!"
    fi
    
    if grep -q "\"sonner\"" "package.json"; then
        echo "✅ sonner package listed"
    else
        echo "❌ sonner package MISSING!"
    fi
    
    if grep -q "\"react-router-dom\"" "package.json"; then
        echo "✅ react-router-dom package listed"
    else
        echo "❌ react-router-dom package MISSING!"
    fi
else
    echo "❌ package.json NOT FOUND!"
fi

echo ""
echo "=================================================="
echo "🎯 Next Steps:"
echo ""
echo "If you see any ❌ above:"
echo "1. Fix the missing files/imports"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:5173/compliance"
echo ""
echo "If everything shows ✅:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:5173/compliance"
echo "3. Check browser console (F12) for errors"
echo ""
