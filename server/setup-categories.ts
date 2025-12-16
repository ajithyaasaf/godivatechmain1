/**
 * Category Setup Script for GodivaTech Blog
 * 
 * This script sets up the 4 core SEO-optimized blog categories
 * Run this once to populate Firestore with the correct categories
 * 
 * Usage: npx tsx server/setup-categories.ts
 */

import { firestoreStorage } from './firestore-storage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const CATEGORIES = [
    {
        id: 1,
        name: 'Web & Mobile Development',
        slug: 'web-mobile-development',
        description: 'Website development, mobile apps, React, responsive design, and web technologies for Madurai businesses',
        order: 1
    },
    {
        id: 2,
        name: 'Digital Marketing & SEO',
        slug: 'digital-marketing-seo',
        description: 'SEO tips, social media marketing, Google Ads, and digital marketing strategies for Tamil Nadu SMEs',
        order: 2
    },
    {
        id: 3,
        name: 'ERP, Billing & Custom Software',
        slug: 'erp-billing-custom-software',
        description: 'ERP systems, billing software, CRM solutions, and custom software development for Madurai businesses',
        order: 3
    },
    {
        id: 4,
        name: 'Design & Branding',
        slug: 'design-branding',
        description: 'Logo design, UI/UX, graphic design, branding strategies, and visual identity',
        order: 4
    }
];

async function setupCategories() {
    console.log('🚀 Setting up GodivaTech blog categories...\n');

    try {
        // Get existing categories
        const existingCategories = await firestoreStorage.getAllCategories();
        console.log(`📊 Found ${existingCategories.length} existing categories\n`);

        // Delete old categories that don't match our new structure
        const categoriesToDelete = existingCategories.filter(
            cat => !CATEGORIES.some(newCat => newCat.name === cat.name)
        );

        if (categoriesToDelete.length > 0) {
            console.log('🗑️  Deleting outdated categories:');
            for (const cat of categoriesToDelete) {
                console.log(`   - ${cat.name}`);
                await firestoreStorage.deleteCategory(cat.id);
            }
            console.log('');
        }

        // Create or update each category
        console.log('✅ Creating/updating categories:\n');

        for (const category of CATEGORIES) {
            const existing = existingCategories.find(cat => cat.name === category.name);

            if (existing) {
                console.log(`   ✓ Updating: ${category.name}`);
                await firestoreStorage.updateCategory(existing.id, {
                    slug: category.slug,
                    description: category.description,
                    order: category.order
                });
            } else {
                console.log(`   + Creating: ${category.name} with ID ${category.id}`);
                // Use the specific ID we want by manually creating the document
                // This ensures we get ID 1, 2, 3, 4 instead of auto-incremented IDs
                const categoryRef = doc(db, 'categories', category.id.toString());
                await setDoc(categoryRef, {
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    order: category.order
                });
                console.log(`   ✓ Assigned ID ${category.id} to ${category.name}`);
            }
        }

        console.log('\n✨ Category setup complete!\n');

        // Display final categories
        const finalCategories = await firestoreStorage.getAllCategories();
        console.log('📋 Final category structure:');
        console.log('═══════════════════════════════════════════════════════════\n');

        finalCategories
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .forEach(cat => {
                console.log(`${cat.order || '?'}. ${cat.name}`);
                console.log(`   Slug: /${cat.slug}`);
                console.log(`   Description: ${cat.description || 'N/A'}`);
                console.log('');
            });

        console.log('═══════════════════════════════════════════════════════════');
        console.log('\n🎯 SEO Strategy:');
        console.log('   - Focus on LOCAL keywords (Madurai, Tamil Nadu)');
        console.log('   - Target 15 posts per category per year');
        console.log('   - Include AI/trends WITHIN service categories');
        console.log('   - Prioritize customer problem-solving content\n');

    } catch (error) {
        console.error('❌ Error setting up categories:', error);
        process.exit(1);
    }
}

// Run the setup
setupCategories()
    .then(() => {
        console.log('✅ Setup completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    });
