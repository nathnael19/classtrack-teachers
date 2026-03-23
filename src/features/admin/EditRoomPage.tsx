import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Layout, ArrowLeft, Save, 
  Users, MapPin, CheckCircle2, Info, ChevronRight,
  Wifi, Monitor, Tv, Wind, Mic2, Power, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const roomSchema = z.object({
  name: z.string().min(2, "Room designation is required"),
  type: z.string().min(1, "Room type is required"),
  capacity: z.string().min(1, "Capacity must be defined"),
  location: z.string().min(2, "Building/Location is required"),
  latitude: z.string().optional().or(z.literal("")),
  longitude: z.string().optional().or(z.literal("")),
  geofenceRadius: z.string().min(1, "Radius is required"),
  description: z.string().optional().or(z.literal("")),
});

type RoomFormValues = z.infer<typeof roomSchema>;

const GlassCard = ({ children, className = "", noHover = false }: { children: React.ReactNode, className?: string, noHover?: boolean }) => (
  <div className={cn(
    "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/60 backdrop-blur-xl shadow-2xl transition-all duration-500 rounded-[2.5rem]",
    !noHover && "hover:shadow-emerald-500/10 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-1",
    className
  )}>
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-black/20 pointer-events-none" />
    {children}
  </div>
);

const PreviewRoomCard = ({ data }: { data: Partial<RoomFormValues> }) => (
  <GlassCard className="p-8 w-full max-w-sm sticky top-8 border-emerald-500/30 ring-1 ring-emerald-500/20 group">
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 group-hover:rotate-6 transition-transform duration-500">
          <Layout className="w-7 h-7" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
            Room Preview
          </Badge>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">Edit Room Mode</span>
        </div>
      </div>

      <div className="space-y-2 min-h-[80px]">
        <h3 className="text-2xl font-black tracking-tighter leading-none line-clamp-2">
          {data.name || "Unnamed Room"}
        </h3>
        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-emerald-600">
          🏢 {data.location || "Building Pending"} • {data.type || "TYPE-X"}
        </p>
        {(data.latitude || data.longitude) && (
          <p className="font-mono text-[9px] text-muted-foreground/60">
            GPS: {data.latitude || "0.0"}, {data.longitude || "0.0"} (r:{data.geofenceRadius}m)
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/10 flex flex-col gap-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Capacity</span>
          <span className="text-lg font-black">{data.capacity || "0"} SEATS</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/10 flex flex-col gap-1 text-right">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Status</span>
          <span className="text-lg font-black text-amber-500 italic">UPDATING</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
         {[Wifi, Monitor, Tv, Wind].map((Icon, i) => (
           <div key={i} className="aspect-square rounded-xl bg-white/5 dark:bg-black/40 border border-white/5 flex items-center justify-center text-muted-foreground/30 hover:text-emerald-500 hover:border-emerald-500/20 transition-all">
              <Icon className="w-4 h-4" />
           </div>
         ))}
      </div>

      <div className="p-4 rounded-2xl bg-emerald-600/5 dark:bg-emerald-400/5 border border-emerald-500/10">
        <p className="text-[11px] font-bold text-muted-foreground/80 leading-relaxed line-clamp-3 italic">
          {data.description || "The room details and equipment will appear here..."}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <div className="w-full h-1 bg-white/10 dark:bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 w-full animate-pulse" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Prefetched</span>
      </div>
    </div>
  </GlassCard>
);

const EditRoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: room, isLoading } = useQuery({
    queryKey: ["room", id],
    queryFn: async () => (await api.get(`/rooms/${id}`)).data,
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      type: "lecture_hall",
      capacity: "0",
      location: "",
      latitude: "",
      longitude: "",
      geofenceRadius: "100",
      description: "",
    }
  });

  useEffect(() => {
    if (room) {
      reset({
        name: room.name,
        type: room.type || "lecture_hall",
        capacity: String(room.capacity || 0),
        location: room.building || "",
        latitude: String(room.latitude || ""),
        longitude: String(room.longitude || ""),
        geofenceRadius: String(room.geofence_radius || 100),
        description: room.description || "",
      });
    }
  }, [room, reset]);

  const formData = useWatch({ control });

  const onSubmit = async (data: RoomFormValues) => {
    setIsSubmitting(true);
    try {
      await api.put(`/rooms/${id}`, {
        name: data.name,
        type: data.type.toLowerCase().replace(/ /g, "_"),
        capacity: parseInt(data.capacity) || null,
        building: data.location,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        geofence_radius: parseFloat(data.geofenceRadius) || 100.0
      });
      toast.success("Room Updated!", {
        description: `${data.name} has been updated successfully.`,
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      });
      navigate("/admin/academic");
    } catch (error: any) {
      toast.error("Failed to Update Room", { description: error?.response?.data?.detail || "Could not save room changes." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    toast.info("Accessing GPS...", { description: "Please allow location access if prompted." });
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude.toString());
        setValue("longitude", position.coords.longitude.toString());
        toast.success("Location Captured!", { 
          description: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}` 
        });
      },
      (error) => {
        toast.error("Location Access Failed", { description: error.message });
      }
    );
  };

  const amenities = [
    { icon: Wifi, label: "High-Speed Mesh" },
    { icon: Monitor, label: "Workstations" },
    { icon: Tv, label: "Interactive Display" },
    { icon: Wind, label: "HVAC Climate Control" },
    { icon: Mic2, label: "Audio Precision" },
    { icon: Power, label: "Universal Sockets" },
  ];

  if (isLoading) {
    return (
      <div className="h-[70vh] w-full flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 animate-spin text-emerald-500" />
        <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Synchronizing Room Data...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[90vh] p-4 md:p-8 overflow-hidden font-sans">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse transition-all duration-1000" />
      <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700 transition-all duration-1000" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[80px] -z-10 animate-pulse delay-300 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/academic")}
          className="mb-8 text-muted-foreground hover:text-foreground group rounded-xl px-4 py-2 hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Academic Management</span>
        </Button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Main Form Section */}
          <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 backdrop-blur-md">
                    <Layout className="w-5 h-5" />
                 </div>
                 <Badge variant="outline" className="border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 px-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">Edit Mode</Badge>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-emerald-600 dark:from-white dark:via-slate-200 dark:to-emerald-400">
                Update Room
              </h1>
              <p className="text-lg font-medium text-muted-foreground/80 max-w-xl leading-relaxed">
                Recalibrate facility parameters and navigational beacons for Room ID: {id}.
              </p>
            </div>

            <GlassCard className="p-1" noHover>
              <div className="bg-white/5 dark:bg-black/20 p-8 md:p-12 h-full rounded-[inherit]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                  <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
                    {/* Room Name */}
                    <div className="space-y-3 col-span-2 group">
                      <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 group-focus-within:opacity-100 transition-opacity">Room Name</Label>
                      <div className="relative">
                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within:text-emerald-500 transition-colors" />
                        <Input 
                          id="name"
                          placeholder="e.g. Nicola Tesla Innovation Lab" 
                          className={cn(
                            "pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl transition-all duration-300 text-lg font-bold placeholder:text-muted-foreground/30",
                            errors.name && "border-rose-500/50"
                          )}
                          {...register("name")}
                        />
                      </div>
                      {errors.name && <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1"><Info className="w-3 h-3" /> {errors.name.message}</p>}
                    </div>

                    {/* Room Type */}
                    <div className="space-y-3">
                      <Label htmlFor="type" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Room Type</Label>
                      <div className="relative">
                         <Select onValueChange={(val) => setValue("type", val)} value={formData.type}>
                            <SelectTrigger className="h-14 bg-white/10 dark:bg-black/40 border-white/10 hover:border-white/20 focus:border-emerald-500/50 rounded-2xl transition-all font-black text-lg capitalize">
                               <SelectValue placeholder="Select type..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-white/10 rounded-2xl shadow-2xl p-1">
                               {["lecture_hall", "computer_lab", "seminar_room", "workshop", "research_studio"].map(t => (
                                 <SelectItem key={t} value={t} className="h-12 rounded-xl focus:bg-emerald-500/10 font-bold capitalize">
                                   {t.replace(/_/g, " ")}
                                 </SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="space-y-3 group">
                      <Label htmlFor="capacity" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Capacity</Label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors" />
                        <Input 
                          id="capacity"
                          type="number"
                          placeholder="40" 
                          className={cn(
                            "pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl transition-all text-lg font-bold",
                            errors.capacity && "border-rose-500/50"
                          )}
                          {...register("capacity")}
                        />
                      </div>
                      {errors.capacity && <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1"><Info className="w-3 h-3" /> {errors.capacity.message}</p>}
                    </div>

                    {/* Location */}
                    <div className="space-y-3 col-span-2 group">
                      <Label htmlFor="location" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Building / Block</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors" />
                        <Input 
                          id="location"
                          placeholder="Main Science Block, Level 2, Room 204" 
                          className={cn(
                            "pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl transition-all text-lg font-bold",
                            errors.location && "border-rose-500/50"
                          )}
                          {...register("location")}
                        />
                      </div>
                    </div>

                    {/* GPS Coordinates */}
                    <div className="col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">GPS Location</Label>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={getCurrentLocation}
                          className="h-8 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-[10px] font-black uppercase tracking-widest px-3 border border-emerald-500/20"
                        >
                          <MapPin className="w-3 h-3 mr-2" />
                          Set Current Coords
                        </Button>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2 group">
                          <Label htmlFor="latitude" className="text-[9px] font-bold uppercase tracking-widest opacity-30">Latitude</Label>
                          <Input 
                            id="latitude"
                            placeholder="9.0320" 
                            className="h-12 bg-white/5 dark:bg-black/20 border-white/10 focus:border-emerald-500/30 rounded-xl transition-all font-mono text-sm"
                            {...register("latitude")}
                          />
                        </div>
                        <div className="space-y-2 group">
                          <Label htmlFor="longitude" className="text-[9px] font-bold uppercase tracking-widest opacity-30">Longitude</Label>
                          <Input 
                            id="longitude"
                            placeholder="38.7510" 
                            className="h-12 bg-white/5 dark:bg-black/20 border-white/10 focus:border-emerald-500/30 rounded-xl transition-all font-mono text-sm"
                            {...register("longitude")}
                          />
                        </div>
                        <div className="space-y-2 group">
                          <Label htmlFor="geofenceRadius" className="text-[9px] font-bold uppercase tracking-widest opacity-30">Radius (m)</Label>
                          <Input 
                            id="geofenceRadius"
                            type="number"
                            placeholder="100" 
                            className="h-12 bg-white/5 dark:bg-black/20 border-white/10 focus:border-emerald-500/30 rounded-xl transition-all font-mono text-sm"
                            {...register("geofenceRadius")}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3 col-span-2 group">
                      <Label htmlFor="description" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Description</Label>
                      <textarea 
                        id="description"
                        rows={3}
                        placeholder="Enter room details and equipment..."
                        className="w-full p-6 bg-white/10 dark:bg-black/40 border-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl transition-all resize-none text-base font-bold placeholder:text-muted-foreground/30"
                        {...register("description")}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 flex flex-col md:flex-row gap-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-[1.25rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all overflow-hidden relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving Changes...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <Save className="w-5 h-5" />
                          Save Update
                        </div>
                      )}
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => navigate("/admin/academic")}
                      variant="outline"
                      className="px-8 h-16 bg-white/5 dark:bg-black/20 border-white/10 hover:border-white/20 rounded-[1.25rem] font-black uppercase tracking-[0.2em] transition-all group flex items-center gap-2"
                    >
                       <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </form>
              </div>
            </GlassCard>

            <div className="flex flex-wrap gap-4 px-2">
               {amenities.map((item, i) => (
                 <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 dark:bg-black/40 border border-white/10 rounded-full animate-in zoom-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    <item.icon className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{item.label}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Right Preview Section */}
          <div className="hidden xl:flex xl:col-span-4 flex-col gap-8 justify-center min-h-[600px] animate-in slide-in-from-right-12 duration-1000">
             <div className="space-y-2 text-right">
                <h2 className="text-2xl font-black italic tracking-tighter text-indigo-500">Preview Hub</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Live feed of entity state</p>
             </div>
             
             <div className="relative">
                <div className="absolute -top-12 -right-12 w-32 h-32 border border-white/5 rounded-full pointer-events-none animate-pulse" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 border border-white/5 rounded-full pointer-events-none" />
                
                <PreviewRoomCard data={formData} />
                
                <div className="mt-8 flex flex-col gap-4 max-w-sm">
                   <div className="flex items-center gap-3 p-4 bg-white/5 dark:bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                         <Info className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground leading-tight">
                         Editing systemic resources requires validation across the entire cluster.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-20 py-10 border-t border-white/5 flex items-center justify-center">
         <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">ClassTrack Facility Hub</span>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Mesh Layer v2.1</span>
         </div>
      </footer>
    </div>
  );
};

export default EditRoomPage;
