"use client";

import { useState, type ReactNode } from "react";
import { CreateEventData } from "@/types/event";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";

interface EventFormProps {
  initialData?: Partial<CreateEventData>;
  onSubmit: (data: CreateEventData) => Promise<void>;
  submitLabel: string;
  title: string;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
      {children}
    </h2>
  );
}

export default function EventForm({
  initialData,
  onSubmit,
  submitLabel,
  title,
}: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  };

  const [form, setForm] = useState<CreateEventData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    event_date: formatDateForInput(initialData?.event_date) || "",
    price: initialData?.price || 0,
    capacity: initialData?.capacity || 1,
    image: initialData?.image || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "capacity"
          ? Number(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data: CreateEventData = {
        ...form,
        event_date: new Date(form.event_date).toISOString(),
      };
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <Card className="p-6 sm:p-8">
          <h1 className="mb-2 text-center text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
            {title}
          </h1>
          <p className="mb-8 text-center text-sm text-zinc-500">
            Completá los datos de tu evento
          </p>

          {error && (
            <div
              className="mb-6 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <SectionTitle>Información general</SectionTitle>
              <div>
                <Label htmlFor="name" className="mb-1.5">
                  Nombre del evento *
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  required
                  maxLength={200}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej: Coldplay en Rosario"
                />
              </div>

              <div>
                <Label htmlFor="description" className="mb-1.5">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Contá de qué se trata el evento..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <SectionTitle>Lugar y fecha</SectionTitle>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="location" className="mb-1.5">
                    Ubicación
                  </Label>
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Ej: Estadio Gigante de Arroyito"
                  />
                </div>

                <div>
                  <Label htmlFor="event_date" className="mb-1.5">
                    Fecha y hora *
                  </Label>
                  <Input
                    type="datetime-local"
                    id="event_date"
                    name="event_date"
                    required
                    value={form.event_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <SectionTitle>Precio y capacidad</SectionTitle>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="price" className="mb-1.5">
                    Precio (ARS) *
                  </Label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min={0}
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="5000"
                  />
                </div>

                <div>
                  <Label htmlFor="capacity" className="mb-1.5">
                    Capacidad *
                  </Label>
                  <Input
                    type="number"
                    id="capacity"
                    name="capacity"
                    required
                    min={1}
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <SectionTitle>Imagen</SectionTitle>
              <div>
                <Label htmlFor="image" className="mb-1.5">
                  URL de la imagen
                </Label>
                <Input
                  type="url"
                  id="image"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? "Guardando…" : submitLabel}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
