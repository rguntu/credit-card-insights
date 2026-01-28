import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from './src/store/store';
import { fetchInsights } from './src/features/insightsSlice';
import { fetchCardUpdates } from './src/features/cardsSlice';
import FreeAiInsightCard from './src/components/FreeAiInsightCard';
import { Button } from './components/ui/button';
// import { Award, CreditCard } from 'lucide-react-native'; // Commented out to prevent crash if native SVG is missing

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { insights, status } = useSelector((state: RootState) => state.insights);
  const { inventory } = useSelector((state: RootState) => state.cards);

  React.useEffect(() => {
    // Check for updates on app launch
    dispatch(fetchCardUpdates());
  }, [dispatch]);

  const handleFetchInsights = () => {
    // Phase 2: dispatch(fetchInsights({ query: 'Which card gives the best Uber rewards?', cards: ['Chase Sapphire Preferred', 'Citi Double Cash'] }));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4">
        <Text className="text-xl font-bold mb-4">My Wallet</Text>
        <Text className="text-lg font-semibold mb-2">Available Cards</Text>
        <FlatList
          data={inventory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-white p-3 rounded-lg mb-2 shadow-sm flex-row items-center">
               {/* Replaced SVG icon with text emoji to fix crash without rebuild */}
               <Text className="text-2xl mr-3">💳</Text>
               <View>
                 <Text className={`font-bold ${!item.name ? 'text-red-500 italic' : ''}`}>
                   {item.name || "Unknown Card"}
                 </Text>
                 <Text className="text-gray-500 text-xs">
                   {item.issuer} • {item.network}
                   {!item.name && <Text className="text-red-500 font-bold ml-2"> (Missing Name)</Text>}
                 </Text>
               </View>
            </View>
          )}
          style={{ maxHeight: 200 }} 
        />

        <Button onPress={handleFetchInsights} className="my-4">
          <Text>Get AI Insights</Text>
        </Button>
      </View>

      {status === 'loading' && <Text className="text-center">Loading...</Text>}
      {status === 'succeeded' && (
        <FlatList
          data={insights}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <FreeAiInsightCard
              cardName={item.text.split(String.fromCharCode(10))[0]}
              category="Travel"
              // Replaced SVG icon with text emoji
              benefitTypeIcon={<Text>🏆</Text>}
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
