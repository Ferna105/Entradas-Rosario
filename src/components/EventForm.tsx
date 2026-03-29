"use client";

import { useState, type ReactNode } from "react";
import { CreateEventData, TicketTypeFormRow } from "@/types/event";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";

interface EventFormProps {
  initialData?: Partial<CreateEventData> & { ticketTypes?: TicketTypeFormRow[] };
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

function defaultTicketTypes(): TicketTypeFormRow[] {
  return [{ name: "General", price: 0, capacity: 100 }];
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

  const [form, setForm] = useState(() => ({
    name: initialData?.name || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    event_date: formatDateForInput(initialData?.event_date) || "",
    image: initialData?.image || "",
    ticketTypes:
      initialData?.ticketTypes && initialData.ticketTypes.length > 0
        ? initialData.ticketTypes.map((t) => ({
            id: t.id,
            name: t.name,
            price: t.price,
            capacity: t.capacity,
            sortOrder: t.sortOrder,
          }))
        : defaultTicketTypes(),
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateTicketType = (
    index: number,
    field: keyof TicketTypeFormRow,
    value: string | number
  ) => {
    setForm((prev) => {
      const next = [...prev.ticketTypes];
      const row = { ...next[index] };
      if (field === "name") row.name = String(value);
      if (field === "price" || field === "capacity") {
        row[field] = Number(value) || 0;
      }
      next[index] = row;
      return { ...prev, ticketTypes: next };
    });
  };

  const addTicketType = () => {
    setForm((prev) => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        { name: "", price: 0, capacity: 100 },
      ],
    }));
  };

  const removeTicketType = (index: number) => {
    setForm((prev) => {
      if (prev.ticketTypes.length <= 1) return prev;
      const next = prev.ticketTypes.filter((_, i) => i !== index);
      return { ...prev, ticketTypes: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data: CreateEventData = {
        name: form.name,
        description: form.description || undefined,
        location: form.location || undefined,
        event_date: new Date(form.event_date).toISOString(),
        image: form.image || undefined,
        ticketTypes: form.ticketTypes.map((t, i) => ({
          id: t.id,
          name: t.name.trim(),
          price: t.price,
          capacity: t.capacity,
          sortOrder: t.sortOrder ?? i,
        })),
      };
      if (data.ticketTypes.some((t) => !t.name)) {
        setError("Cada tipo de entrada necesita un nombre.");
        setLoading(false);
        return;
      }
      await onSubmit(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar el evento"
      );
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
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <SectionTitle>Tipos de entrada</SectionTitle>
                <Button
                  type="button"
                  variant="ghost"
                  className="shrink-0 text-sm text-violet-400"
                  onClick={addTicketType}
                >
                  + Agregar tipo
                </Button>
              </div>
              <p className="text-xs text-zinc-500">
                Cada tipo tiene su propio precio y cupo (General, VIP, Preventa,
                etc.).
              </p>
              <div className="space-y-4">
                {form.ticketTypes.map((row, index) => (
                  <Card
                    key={index}
                    className="border-white/10 bg-zinc-950/40 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-zinc-400">
                        Tipo {index + 1}
                      </span>
                      {form.ticketTypes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-auto py-1 text-xs text-red-400"
                          onClick={() => removeTicketType(index)}
                        >
                          Quitar
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-3">
                        <Label className="mb-1.5">Nombre *</Label>
                        <Input
                          required
                          value={row.name}
                          onChange={(e) =>
                            updateTicketType(index, "name", e.target.value)
                          }
                          placeholder="Ej: General, VIP, Preventa"
                        />
                      </div>
                      <div>
                        <Label className="mb-1.5">Precio (ARS) *</Label>
                        <Input
                          type="number"
                          required
                          min={0}
                          step="0.01"
                          value={row.price}
                          onChange={(e) =>
                            updateTicketType(
                              index,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label className="mb-1.5">Cupo *</Label>
                        <Input
                          type="number"
                          required
                          min={1}
                          value={row.capacity}
                          onChange={(e) =>
                            updateTicketType(
                              index,
                              "capacity",
                              parseInt(e.target.value, 10) || 1
                            )
                          }
                        />
                      </div>
                    </div>
                  </Card>
                ))}
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
