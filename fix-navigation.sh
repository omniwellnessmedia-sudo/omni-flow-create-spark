#!/bin/bash

# Replace all Navigation imports with MegaNavigation
find src/pages -name "*.tsx" -exec sed -i 's/import Navigation from "@\/components\/Navigation";/import MegaNavigation from "@\/components\/MegaNavigation";/g' {} +
find src/pages -name "*.tsx" -exec sed -i 's/<Navigation \/>/<MegaNavigation \/>/g' {} +
find src/pages -name "*.tsx" -exec sed -i 's/<Navigation>/<MegaNavigation>/g' {} +
find src/pages -name "*.tsx" -exec sed -i 's/<\/Navigation>/<\/MegaNavigation>/g' {} +