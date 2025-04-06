
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const currentYear = new Date().getFullYear();

const formSchema = z.object({
  make: z.string().min(1, { message: "Car make is required" }),
  model: z.string().min(1, { message: "Car model is required" }),
  year: z.string().refine((val) => {
    const year = parseInt(val);
    return year >= 1900 && year <= currentYear;
  }, { message: `Year must be between 1900 and ${currentYear}` }),
  kilometers: z.string().refine((val) => {
    const km = parseInt(val);
    return !isNaN(km) && km >= 0 && km <= 1000000;
  }, { message: "Kilometers must be between 0 and 1,000,000" }),
  numberPlate: z.string().optional(),
  fuelType: z.enum(["petrol", "diesel", "electric", "hybrid", "cng", "lpg"]),
  transmission: z.enum(["manual", "automatic", "semi-automatic"]),
  color: z.string().optional(),
});

export type CarFormData = z.infer<typeof formSchema>;

const CarForm: React.FC<{
  onSubmit: (data: CarFormData) => void;
  initialData?: Partial<CarFormData>;
}> = ({ onSubmit, initialData = {} }) => {
  const form = useForm<CarFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: initialData.make || "",
      model: initialData.model || "",
      year: initialData.year || currentYear.toString(),
      kilometers: initialData.kilometers || "",
      numberPlate: initialData.numberPlate || "",
      fuelType: initialData.fuelType || "petrol",
      transmission: initialData.transmission || "manual",
      color: initialData.color || "",
    },
  });

  function handleSubmit(data: CarFormData) {
    onSubmit(data);
  }

  // Helper function to render required field indicator
  const RequiredIndicator = () => <span className="text-red-500 ml-1">*</span>;

  return (
    <Card className="shadow-lg border-t-4 border-t-car-blue">
      <CardHeader className="bg-gray-50 rounded-t-lg">
        <CardTitle className="text-car-blue flex items-center">Car Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Make
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Toyota, Honda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Model
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Camry, Civic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Red, Blue, Silver" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Year
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={currentYear.toString()} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kilometers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Kilometers
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 45000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberPlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number Plate</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. KA01AB1234" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide this for legal status check
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Fuel Type
                      <RequiredIndicator />
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                        <SelectItem value="lpg">LPG</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Transmission
                      <RequiredIndicator />
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="semi-automatic">Semi-automatic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-car-blue hover:bg-car-blue/90">
              Proceed to Analysis
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CarForm;
