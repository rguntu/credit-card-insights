import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from './src/store/store';
import { fetchInsights } from './src/features/insightsSlice';
import FreeAiInsightCard from './src/components/FreeAiInsightCard';
import { Button } from './components/ui/button'; // Adjusted import path
import { Award } from 'lucide-react-native';

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { insights, status } = useSelector((state: RootState) => state.insights);

  const handleFetchInsights = () => {
    // Phase 2: dispatch(fetchInsights({ query: 'Which card gives the best Uber rewards?', cards: ['Chase Sapphire Preferred', 'Citi Double Cash'] }));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4">
        <Button onPress={handleFetchInsights}>
          <Text>Get AI Insights</Text>
        </Button>
      </View>
      {/* Phase 2:
      <Button onPress={handleFetchInsights}>
        <Text>Get AI Insights</Text>
      </Button>
      */}

      {status === 'loading' && <Text className="text-center">Loading...</Text>}
      {status === 'succeeded' && (
        <FlatList
          data={insights}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <FreeAiInsightCard
              cardName={item.text.split('\n')[0]} // Example parsing
              category="Travel" // Example category
              benefitTypeIcon={<Award className="h-5 w-5 text-blue-500" />}
              description={item.text}
              paidPreview={true}
            />
          )}
        />
      )}
      {status === 'failed' && <Text className="text-center text-red-500">Error fetching insights.</Text>}
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
