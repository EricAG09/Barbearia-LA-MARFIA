import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const services = [
  { id: "corte", name: "Corte Tradicional - R$40" },
  { id: "barba", name: "Barba Completa - R$25" },
  { id: "combo", name: "Combo Premium - R$60" },
  { id: "coloracao", name: "Coloração - R$80" },
];

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const formSchema = z.object({
  name: z.string().min(3, { message: "Nome é obrigatório" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  service: z.string({ required_error: "Selecione um serviço" }),
  date: z.date({ required_error: "Selecione uma data" }),
  time: z.string({ required_error: "Selecione um horário" }),
});

const Booking = () => {
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Agendamento realizado!",
      description: `${values.name}, seu agendamento para ${format(values.date, "dd/MM/yyyy")} às ${values.time} foi confirmado.`,
      duration: 5000,
    });
    
    form.reset();
  };

  return (
    <section
      id="booking"
      className="booking section-padding bg-gradient-to-b from-barber-dark to-barber-darker"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Agende seu <span className="text-barber-gold">Horário</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-barber-gold"></div>
            <CalendarIcon size={20} className="text-barber-gold" />
            <div className="h-px w-12 bg-barber-gold"></div>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Escolha o dia e horário de sua preferência e venha vivenciar uma experiência única.
          </p>
        </div>
        
        <div className="max-w-md mx-auto bg-barber-darker/80 backdrop-blur-md p-6 rounded-lg border border-barber-gold/20">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Nome</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Seu nome completo" 
                        {...field}
                        className="bg-barber-dark border-barber-gold/20 text-white focus-visible:ring-barber-gold"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Telefone</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(00) 00000-0000" 
                        {...field}
                        className="bg-barber-dark border-barber-gold/20 text-white focus-visible:ring-barber-gold"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Serviço</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-barber-dark border-barber-gold/20 text-white focus:ring-barber-gold">
                          <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-barber-darker border-barber-gold/20">
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id} className="focus:bg-barber-gold/20 focus:text-white">
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-300">Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full bg-barber-dark border-barber-gold/20 text-left text-white",
                              !field.value && "text-gray-500"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-barber-darker border-barber-gold/20">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setDate(date);
                          }}
                          disabled={(date) => 
                            date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                            date > new Date(new Date().setMonth(new Date().getMonth() + 1)) ||
                            date.getDay() === 0 // Domingo
                          }
                          locale={ptBR}
                          className="bg-barber-darker text-white"
                          classNames={{
                            day_selected: "bg-barber-gold text-barber-darker hover:bg-barber-gold",
                            day_today: "border-barber-gold text-barber-gold",
                            day: "text-white hover:bg-barber-gold/20",
                            head_cell: "text-barber-gold",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Horário</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-barber-dark border-barber-gold/20 text-white focus:ring-barber-gold">
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-barber-darker border-barber-gold/20">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time} className="focus:bg-barber-gold/20 focus:text-white">
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-barber-gold text-barber-dark hover:bg-barber-gold/80"
              >
                Agendar Horário
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Booking;
