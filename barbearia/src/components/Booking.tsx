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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, MessageCircle, X, Clock, Users } from "lucide-react";
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
  { id: "corte-social", name: "Corte Social", price: "R$24,90", value: 24.90, duration: 30 },
  { id: "corte-degrade", name: "Corte Degradê", price: "R$24,90", value: 24.90, duration: 30 },
  { id: "corte-infantil", name: "Corte Infantil", price: "R$30,00", value: 30.00, duration: 25 },
  { id: "sobrancelha", name: "Sobrancelha", price: "R$5,00", value: 5.00, duration: 10 },
  { id: "barba", name: "Barba", price: "R$10,00", value: 14.00, duration: 20 },
  { id: "corte-degrade-barba", name: "Combo Prince", price: "R$44,00", value: 44.00, duration: 50 },
  { id: "corte-degrade-pigmentacao", name: "Combo Cuidado do rei", price: "R$44,90", value: 44.90, duration: 45 },
  { id: "corte-degrade-pigmentacao-barba", name: "Combo Style jacu", price: "R$49,90", value: 49.90, duration: 65 },
];

const timeSlots = [
  "09:00",
  "09:38",
  "10:00",
  "10:38",
  "11:00",
  "11:38",
  "12:00",
  "13:30",
  "14:00",
  "14:38",
  "15:00",
  "15:38",
  "16:00",
  "16:38",
  "17:00",
  "17:38",
  "18:00",
];

const formSchema = z.object({
  name: z.string().min(3, { message: "Nome é obrigatório" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  services: z.array(z.string()).min(1, { message: "Selecione pelo menos um serviço" }),
  date: z.date({ required_error: "Selecione uma data" }),
  bookingType: z.enum(["scheduled", "walk_in"], { required_error: "Selecione o tipo de agendamento" }),
  time: z.string().optional(),
});

const Booking = () => {
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState<"scheduled" | "walk_in">("scheduled");
  const { toast } = useToast();
  const { createBooking } = useBookings();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      services: [],
      bookingType: "scheduled",
    },
  });

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.value || 0);
    }, 0);
  };

  const calculateTotalDuration = (serviceIds: string[]) => {
    return serviceIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.duration || 30);
    }, 0);
  };

  const handleServiceToggle = (serviceId: string) => {
    const updatedServices = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    setSelectedServices(updatedServices);
    form.setValue("services", updatedServices);
    
    // Limpar horário selecionado quando mudar serviços para recalcular disponibilidade
    if (bookingType === "scheduled") {
      form.setValue("time", "");
    }
  };

  const removeService = (serviceId: string) => {
    const updatedServices = selectedServices.filter(id => id !== serviceId);
    setSelectedServices(updatedServices);
    form.setValue("services", updatedServices);
    
    // Limpar horário selecionado quando mudar serviços
    if (bookingType === "scheduled") {
      form.setValue("time", "");
    }
  };

  const sendToWhatsApp = (values: z.infer<typeof formSchema>) => {
    const selectedServicesList = values.services.map(serviceId => {
      const service = services.find(s => s.id === serviceId);
      return service ? `${service.name} - ${service.price} (${service.duration}min)` : serviceId;
    }).join('\n• ');
    
    const total = calculateTotal();
    const totalDuration = calculateTotalDuration(values.services);
    const formattedDate = format(values.date, "dd/MM/yyyy", { locale: ptBR });
    const bookingTypeText = values.bookingType === "scheduled" ? "Horário Marcado" : "Ordem de Chegada";
    
    const message = `*Novo Agendamento - The Prince of Jacu*\n\n` +
      `*Nome:* ${values.name}\n` +
      `*Telefone:* ${values.phone}\n` +
      `*Serviços:*\n• ${selectedServicesList}\n` +
      `*Total:* R$${total.toFixed(2).replace('.', ',')}\n` +
      `*Duração Total:* ${totalDuration} minutos\n` +
      `*Data:* ${formattedDate}\n` +
      `*Tipo:* ${bookingTypeText}\n` +
      (values.bookingType === "scheduled" && values.time ? `*Horário:* ${values.time}\n` : "") +
      `\nAgendamento confirmado automaticamente!`;

    const whatsappUrl = `https://wa.me/5585992400522?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const resetForm = () => {
    form.reset({
      name: "",
      phone: "",
      services: [],
      bookingType: "scheduled",
      time: "",
    });
    setDate(undefined);
    setSelectedServices([]);
    setBookingType("scheduled");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
  setIsSubmitting(true);

  try {
    const bookingTime = values.bookingType === "walk_in" ? "00:00" : values.time!;
    const formattedDate = format(values.date, "yyyy-MM-dd");

    // Criar um agendamento por serviço
    await Promise.all(values.services.map(async (serviceId) => {
      const serviceInfo = services.find(s => s.id === serviceId);
      if (!serviceInfo) return;

      const singleBooking = {
        name: values.name,
        phone: values.phone,
        service: values.services.join(', '), // ⬅️ agora salva apenas um serviço por agendamento
        booking_date: formattedDate,
        booking_time: bookingTime,
        status: 'confirmed',
        booking_type: values.bookingType
      };

      await createBooking.mutateAsync(singleBooking);
    }));

    toast({
      title: "Agendamento Confirmado!",
      description: "Suas reservas foram salvas com sucesso. Enviando para WhatsApp...",
      duration: 3000,
    });

    setTimeout(() => {
      sendToWhatsApp(values);
      resetForm();
    }, 1500);
    
  } catch (error) {
    console.error('Erro ao criar agendamentos:', error);
    toast({
      title: "Erro",
      description: "Este horário já está ocupado!",
      variant: "destructive",
      duration: 5000,
    });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <section
      id="booking"
      className="booking section-padding bg-gradient-to-b from-barber-dark to-barber-darker"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-personalizada text-3xl md:text-4xl font-bold mb-4">
            Agende seu <span className="">Horário</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-barber-gold"></div>
            <CalendarIcon size={20} className="text-barber-gold" />
            <div className="h-px w-12 bg-barber-gold"></div>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Escolha o dia, horário e serviços de sua preferência ou opte por ordem de chegada.
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
                name="services"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      Serviços {selectedServices.length > 0 && (
                        <span className="text-barber-gold text-sm">
                          (Total: R${calculateTotal().toFixed(2).replace('.', ',')} - {calculateTotalDuration(selectedServices)}min)
                        </span>
                      )}
                    </FormLabel>
                    
                    {/* Serviços selecionados */}
                    {selectedServices.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedServices.map(serviceId => {
                          const service = services.find(s => s.id === serviceId);
                          return service ? (
                            <div key={serviceId} className="bg-barber-gold/20 text-barber-gold px-3 py-1 rounded-full text-sm flex items-center gap-2">
                              <span>{service.name} ({service.duration}min)</span>
                              <button
                                type="button"
                                onClick={() => removeService(serviceId)}
                                className="hover:bg-barber-gold/30 rounded-full p-1"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}

                    <div className="space-y-3 max-h-64 overflow-y-auto border border-barber-gold/20 rounded-md p-3">
                      {services.map((service) => (
                        <div key={service.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={service.id}
                            checked={selectedServices.includes(service.id)}
                            onCheckedChange={() => handleServiceToggle(service.id)}
                            className="border-barber-gold/50 data-[state=checked]:bg-barber-gold data-[state=checked]:border-barber-gold"
                          />
                          <label
                            htmlFor={service.id}
                            className="flex-1 cursor-pointer text-sm text-white hover:text-barber-gold transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span>{service.name}</span>
                                <span className="text-gray-400 text-xs block">({service.duration} minutos)</span>
                              </div>
                              <span className="text-barber-gold font-medium">{service.price}</span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
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
                            if (bookingType === "scheduled") {
                              form.setValue("time", "");
                            }
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
                name="bookingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Tipo de Agendamento</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setBookingType(value as "scheduled" | "walk_in");
                          if (value === "walk_in") {
                            form.setValue("time", "");
                          }
                        }}
                        className="flex flex-col space-y-3"
                      >
                        <div className="flex items-center space-x-3 p-3 bg-barber-dark/50 rounded-lg border border-barber-gold/20">
                          <RadioGroupItem value="scheduled" id="scheduled" className="border-barber-gold text-barber-gold" />
                          <label htmlFor="scheduled" className="flex items-center gap-2 text-white cursor-pointer flex-1">
                            <Clock size={16} className="text-barber-gold" />
                            <div>
                              <div className="font-medium">Horário Marcado</div>
                              <div className="text-sm text-gray-400">Escolha um horário específico</div>
                            </div>
                          </label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-barber-dark/50 rounded-lg border border-barber-gold/20">
                          <RadioGroupItem value="walk_in" id="walk_in" className="border-barber-gold text-barber-gold" />
                          <label htmlFor="walk_in" className="flex items-center gap-2 text-white cursor-pointer flex-1">
                            <Users size={16} className="text-barber-gold" />
                            <div>
                              <div className="font-medium">Ordem de Chegada</div>
                              <div className="text-sm text-gray-400">Chegue quando quiser no dia escolhido</div>
                            </div>
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              {bookingType === "scheduled" && (
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        Horário {selectedServices.length > 0 && (
                          <span className="text-barber-gold text-sm">
                            ({calculateTotalDuration(selectedServices)}min necessários)
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
              )}
              
              <Button 
                type="submit" 
                disabled={isSubmitting || selectedServices.length === 0 || (bookingType === "scheduled" && !form.watch("time"))}
                className="w-full bg-barber-gold text-barber-dark hover:bg-barber-gold/80"
              >
                {isSubmitting ? (
                  "Processando agendamento..."
                ) : (
                  <>
                    <MessageCircle size={16} className="mr-2" />
                    Confirmar Agendamento
                    {selectedServices.length > 0 && (
                      <span className="ml-2 font-bold">
                        (R${calculateTotal().toFixed(2).replace('.', ',')})
                      </span>
                    )}
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
