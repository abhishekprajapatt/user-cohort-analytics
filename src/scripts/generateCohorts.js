import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import { generateAllCohorts } from '../services/cohortService.js';
import logger from '../utils/logger.js';

// Load environment variables
dotenv.config();

/**
 * Generate cohorts for all users and display results
 */
const runCohortGeneration = async () => {
  try {
    logger.info('🎯 Starting cohort generation...');

    // Connect to database
    await connectDB();

    // Generate cohorts using rule-based approach
    logger.info('📊 Generating rule-based cohorts...');
    const ruleBasedResults = await generateAllCohorts(false);

    console.log('\n🔹 RULE-BASED COHORT RESULTS:');
    console.log('===========================================');
    console.log(`📊 Total Users Processed: ${ruleBasedResults.totalUsers}`);
    console.log(`✅ Successfully Updated: ${ruleBasedResults.updatedUsers}`);
    console.log(`❌ Errors: ${ruleBasedResults.errors.length}`);

    console.log('\n📈 COHORT DISTRIBUTION:');
    Object.entries(ruleBasedResults.cohortDistribution).forEach(
      ([cohort, count]) => {
        const percentage = (
          (count / ruleBasedResults.totalUsers) *
          100
        ).toFixed(1);
        console.log(`   ${cohort}: ${count} users (${percentage}%)`);
      }
    );

    if (ruleBasedResults.errors.length > 0) {
      console.log('\n⚠️  ERRORS:');
      ruleBasedResults.errors.slice(0, 5).forEach((error) => {
        console.log(`   User ${error.userId}: ${error.error}`);
      });
      if (ruleBasedResults.errors.length > 5) {
        console.log(
          `   ... and ${ruleBasedResults.errors.length - 5} more errors`
        );
      }
    }

    // Generate cohorts using K-means clustering
    logger.info('\n🤖 Generating K-means based cohorts...');
    const kmeansResults = await generateAllCohorts(true);

    console.log('\n🔹 K-MEANS CLUSTERING RESULTS:');
    console.log('===========================================');
    if (kmeansResults.clusteringResults) {
      console.log('📊 CLUSTER ANALYSIS:');
      kmeansResults.clusteringResults.forEach((cluster) => {
        console.log(`\n   Cluster ${cluster.clusterId}: ${cluster.name}`);
        console.log(`   👥 Users: ${cluster.userCount}`);
        console.log(
          `   💰 Avg Cart Value: ₹${cluster.characteristics.avgCartValue}`
        );
        console.log(
          `   📅 Avg Frequency: ${cluster.characteristics.avgFrequency} orders/month`
        );
        console.log(
          `   ⏰ Avg Recency: ${cluster.characteristics.avgRecency} days`
        );
        console.log(
          `   💎 Avg Lifetime Value: ₹${cluster.characteristics.avgLifetimeValue}`
        );
      });
    } else {
      console.log(
        '⚠️  K-means clustering could not be performed (insufficient data)'
      );
    }

    // Display final cohort statistics
    console.log('\n🎯 FINAL COHORT DISTRIBUTION:');
    console.log('===========================================');
    Object.entries(kmeansResults.cohortDistribution).forEach(
      ([cohort, count]) => {
        const percentage = ((count / kmeansResults.totalUsers) * 100).toFixed(
          1
        );
        console.log(`   ${cohort}: ${count} users (${percentage}%)`);
      }
    );

    // Show business insights
    console.log('\n💡 BUSINESS INSIGHTS:');
    console.log('===========================================');

    const highSpenders = kmeansResults.cohortDistribution['High Spender'] || 0;
    const frequentBuyers =
      kmeansResults.cohortDistribution['Frequent Buyer'] || 0;
    const atRisk = kmeansResults.cohortDistribution['At Risk'] || 0;
    const inactive = kmeansResults.cohortDistribution['Inactive'] || 0;

    console.log(
      `💰 High Value Customers: ${highSpenders + frequentBuyers} users`
    );
    console.log(`⚠️  Customers Needing Attention: ${atRisk + inactive} users`);
    console.log(
      `📈 Potential for Upselling: ${
        kmeansResults.cohortDistribution['Regular Customer'] || 0
      } users`
    );
    console.log(
      `🆕 New Customer Onboarding: ${
        kmeansResults.cohortDistribution['New Customer'] || 0
      } users`
    );

    // Recommendations
    console.log('\n🎯 MARKETING RECOMMENDATIONS:');
    console.log('===========================================');

    if (highSpenders > 0) {
      console.log(`🌟 Launch VIP program for ${highSpenders} High Spenders`);
    }
    if (frequentBuyers > 0) {
      console.log(
        `🔄 Create loyalty rewards for ${frequentBuyers} Frequent Buyers`
      );
    }
    if (atRisk > 0) {
      console.log(
        `📧 Send re-engagement campaigns to ${atRisk} At Risk customers`
      );
    }
    if (inactive > 0) {
      console.log(
        `🎁 Offer comeback discounts to ${inactive} Inactive customers`
      );
    }

    logger.info('\n✅ Cohort generation completed successfully!');
    logger.info('🚀 Your cohort analysis is ready for marketing campaigns!');
  } catch (error) {
    logger.error('❌ Error in cohort generation:', error);
    throw error;
  } finally {
    mongoose.connection.close();
  }
};

// Run the cohort generation
runCohortGeneration().catch(console.error);
