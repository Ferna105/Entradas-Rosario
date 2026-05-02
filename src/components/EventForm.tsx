"use client";

import { useState } from "react";
import {
  CreateEventData,
  EVENT_CATEGORIES,
  EventCategory,
  TicketTypeFormRow,
} from "@/types/event";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { FormSection } from "@/components/FormSection";

interface EventFormProps {
  initialData?: Partial<CreateEventData> & { ticketTypes?: TicketTypeFormRow[] };
  onSubmit: (data: CreateEventData) => Promise<void>;
  submitLabel: string;
  title: string;
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
    category: (initialData?.category as EventCategory | undefined) ?? "otros",
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
        category: form.category as EventCategory,
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
            <FormSection title="Información general">
              <Input
                type="text"
                id="name"
                name="name"
                required
                maxLength={200}
                value={form.name}
                onChange={handleChange}
                label="Nombre del evento *"
                placeholder="Ej: Coldplay en Rosario"
              />
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                label="Descripción"
                placeholder="Contá de qué se trata el evento..."
              />
              <div>
                <label
                  htmlFor="category"
                  className="mb-[6px] block text-[12px] font-semibold uppercase tracking-[0.04em] text-text-secondary"
                >
                  Categoría
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      category: e.target.value as EventCategory,
                    }))
                  }
                  className="h-[42px] w-full appearance-none rounded-[12px] border border-ink-4 bg-ink-2 px-3 text-[14px] capitalize text-text-primary outline-none transition-colors focus:border-violet-400 focus:[box-shadow:0_0_0_3px_rgba(139,92,255,0.15)]"
                >
                  {EVENT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </FormSection>

            <FormSection title="Lugar y fecha">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  type="text"
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  label="Ubicación"
                  icon="pin"
                  placeholder="Ej: Estadio Gigante de Arroyito"
                />
                <Input
                  type="datetime-local"
                  id="event_date"
                  name="event_date"
                  required
                  value={form.event_date}
                  onChange={handleChange}
                  label="Fecha y hora *"
                  icon="calendar"
                />
              </div>
            </FormSection>

            <FormSection
              title="Tipos de entrada"
              action={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addTicketType}
                >
                  + Agregar tipo
                </Button>
              }
            >
              <div className="space-y-4">
                {form.ticketTypes.map((row, index) => (
                  <Card
                    key={index}
                    className="border-ink-4 bg-ink-2/60 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                        Tipo {index + 1}
                      </span>
                      {form.ticketTypes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTicketType(index)}
                        >
                          Quitar
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-3">
                        <Input
                          required
                          value={row.name}
                          onChange={(e) =>
                            updateTicketType(index, "name", e.target.value)
                          }
                          label="Nombre *"
                          placeholder="Ej: General, VIP, Preventa"
                        />
                      </div>
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
                        label="Precio (ARS) *"
                        suffix="$"
                      />
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
                        label="Cupo *"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </FormSection>

            <FormSection title="Imagen">
              <Input
                type="url"
                id="image"
                name="image"
                value={form.image}
                onChange={handleChange}
                label="URL de la imagen"
                icon="upload"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </FormSection>

            <div className="flex flex-col-reverse gap-3 border-t border-ink-4 pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                loading={loading}
                className="w-full sm:w-auto"
              >
                {submitLabel}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
