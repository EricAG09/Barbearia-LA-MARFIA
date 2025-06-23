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
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, MessageCircle } from "lucide-react";
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
import { useBookings } from "@/hooks/useBookings";

const services = [
  { id: "corte-social", name: "Corte Social", price: "R$24,90" },
  { id: "corte-degrade", name: "Corte Degradê", price: "R$24,90" },
  { id: "corte-degrade-barba", name: "Corte Degradê + Barba", price: "R$35,00" },
  { id: "corte-degrade-pigmentacao", name: "Corte Degradê + Pigmentação", price: "R$35,00" },
  { id: "corte-degrade-pigmentacao-barba", name: "Corte Degradê + Pigmentação + Barba", price: "R$45,00" },
  { id: "corte-completo", name: "Corte Degradê + Pigmentação + Barba + Sobrancelha", price: "R$50,00" },
  { id: "corte-social-pigmentacao-barba", name: "Corte Social + Pigmentação + Barba", price: "R$40,00" },
  { id: "corte-degrade-sobrancelha", name: "Corte Degradê + Sobrancelha", price: "R$30,00" },
  { id: "corte-social-barba", name: "Corte Social + Barba", price: "R$30,00" },
  { id: "corte-infantil", name: "Corte Infantil", price: "R$30,00" },
  { id: "sobrancelha", name: "Sobrancelha", price: "R$5,00" },
  { id: "barba", name: "Barba", price: "R$10,00" },
  { id: "platinado", name: "Platinado", price: "R$100,00" },
  { id: "luzes", name: "Luzes", price: "R$80,00" },
  { id: "pezinho", name: "Pezinho", price: "R$5,00" },
];

const timeSlots = [
  "09:00",
  "09:15",
  "09:30",
  "09:45",
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { getBookingsByDate, checkAvailability, createBooking } = useBookings();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const getAvailableTimeSlots = (selectedDate: Date | undefined) => {
    if (!selectedDate) return timeSlots;
    
    const dayBookings = getBookingsByDate(selectedDate);
    const bookedTimes = dayBookings.map(booking => booking.booking_time);
    
    return timeSlots.filter(time => !bookedTimes.includes(time));
  };

  const sendToWhatsApp = (values: z.infer<typeof formSchema>) => {
    const service = services.find(s => s.id === values.service);
    const serviceName = service ? `${service.name} - ${service.price}` : values.service;
    const formattedDate = format(values.date, "dd/MM/yyyy", { locale: ptBR });
    
    const message = `*Novo Agendamento - Master Barber*\n\n` +
      `🙍🏻‍♂️ *Nome:* ${values.name}\n` +
      `📞 *Telefone:* ${values.phone}\n` +
      `✂️ *Serviço:* ${serviceName}\n` +
      `📅 *Data:* ${formattedDate}\n` +
      `🕐 *Horário:* ${values.time}\n\n` +
      `Agendamento confirmado automaticamente!`;

    const whatsappUrl = `https://wa.me/5585994066861?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const resetForm = () => {
    form.reset({
      name: "",
      phone: "",
      service: "",
      time: "",
    });
    setDate(undefined);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Verificar disponibilidade no banco de dados
      const isAvailable = await checkAvailability(values.date, values.time);
      
      if (!isAvailable) {
        toast({
          title: "Horário Indisponível",
          description: "Este horário já está ocupado. Por favor, escolha outro horário.",
          variant: "destructive",
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      // Criar a reserva no banco de dados
      const booking = {
        name: values.name,
        phone: values.phone,
        service: values.service,
        booking_date: format(values.date, "yyyy-MM-dd"),
        booking_time: values.time,
        status: 'confirmed'
      };

      await createBooking.mutateAsync(booking);

      toast({
        title: "Agendamento Confirmado!",
        description: "Sua reserva foi salva com sucesso. Enviando para WhatsApp...",
        duration: 3000,
      });

      // Enviar para WhatsApp e resetar formulário
      setTimeout(() => {
        sendToWhatsApp(values);
        resetForm();
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: "Erro",
        description: "Houve um problema ao processar seu agendamento. Tente novamente.",
        variant: "destructive",
        duration: 5000,
      });

      console.log("Erro aqui", error)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="booking"
      className="section-padding bg-gradient-to-b from-barber-dark to-barber-darker"
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
            Escolha o dia e horário de sua preferência. Sistema integrado com banco de dados para verificação em tempo real.
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
                        placeholder="(85) 99999-9999" 
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
                        <SelectTrigger className="bg-barber-dark border-barber-gold/20 text-white focus:ring-barber-gold min-h-[44px]">
                          <SelectValue placeholder="Selecione um serviço" className="text-left" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-barber-darker border-barber-gold/20 max-h-64 overflow-y-auto">
                        {services.map((service) => (
                          <SelectItem 
                            key={service.id} 
                            value={service.id} 
                            className="focus:bg-barber-gold/20 focus:text-white py-3 px-4 cursor-pointer"
                          >
                            <div className="flex flex-col items-start w-full min-w-0">
                              <span className="text-sm font-medium text-white truncate w-full">
                                {service.name}
                              </span>
                              <span className="text-xs text-barber-gold mt-1">
                                {service.price}
                              </span>
                            </div>
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
                            form.setValue("time", "");
                          }}
                          disabled={(date) => 
                            date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                            date > new Date(new Date().setMonth(new Date().getMonth() + 1)) ||
                            date.getDay() === 0
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
                    <FormLabel className="text-gray-300">
                      Horário {date && (
                        <span className="text-barber-gold text-sm">
                          ({getAvailableTimeSlots(date).length} disponíveis)
                        </span>
                      )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-barber-dark border-barber-gold/20 text-white focus:ring-barber-gold">
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-barber-darker border-barber-gold/20">
                        {getAvailableTimeSlots(date).map((time) => (
                          <SelectItem key={time} value={time} className="focus:bg-barber-gold/20 focus:text-white">
                            {time}
                          </SelectItem>
                        ))}
                        {getAvailableTimeSlots(date).length === 0 && (
                          <div className="px-3 py-2 text-gray-400 text-sm">
                            Nenhum horário disponível
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-barber-gold text-barber-dark hover:bg-barber-gold/80"
              >
                {isSubmitting ? (
                  "Processando agendamento..."
                ) : (
                  <>
                    <MessageCircle size={16} className="mr-2" />
                    Confirmar Agendamento
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Booking;