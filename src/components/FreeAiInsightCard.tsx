import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react-native';

interface FreeAiInsightCardProps {
  cardName: string;
  category: string;
  benefitTypeIcon: React.ReactNode;
  description: string;
  paidPreview?: boolean;
}

const FreeAiInsightCard: React.FC<FreeAiInsightCardProps> = ({
  cardName,
  category,
  benefitTypeIcon,
  description,
  paidPreview = false,
}) => {
  return (
    <Card className="m-2 rounded-lg shadow-md">
      <CardHeader>
        <View className="flex-row items-center justify-between">
          <CardTitle className="font-bold">{cardName}</CardTitle>
          {benefitTypeIcon}
        </View>
        <Badge className="mt-2 self-start">{category}</Badge>
      </CardHeader>
      <CardContent>
        <Text>{description}</Text>
        {paidPreview && (
          <Button variant="outline" className="mt-4">
            <Text>View More</Text>
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FreeAiInsightCard;
