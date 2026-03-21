"use client";

import { useState } from "react";
import { CreateEventData } from "@/types/event";

interface EventFormProps {
  initialData?: Partial<CreateEventData>;
  onSubmit: (data: CreateEventData) => Promise<void>;
  submitLabel: string;
  title: string;
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {title}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-900 mb-1"
              >
                Nombre del evento *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                maxLength={200}
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                placeholder="Ej: Coldplay en Rosario"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-900 mb-1"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-colors resize-none"
                placeholder="Contá de qué se trata el evento..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold text-gray-900 mb-1"
                >
                  Ubicación
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  placeholder="Ej: Estadio Gigante de Arroyito"
                />
              </div>

              <div>
                <label
                  htmlFor="event_date"
                  className="block text-sm font-semibold text-gray-900 mb-1"
                >
                  Fecha y hora *
                </label>
                <input
                  type="datetime-local"
                  id="event_date"
                  name="event_date"
                  required
                  value={form.event_date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-semibold text-gray-900 mb-1"
                >
                  Precio (ARS) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  placeholder="5000"
                />
              </div>

              <div>
                <label
                  htmlFor="capacity"
                  className="block text-sm font-semibold text-gray-900 mb-1"
                >
                  Capacidad *
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  required
                  min={1}
                  value={form.capacity}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  placeholder="200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-semibold text-gray-900 mb-1"
              >
                URL de la imagen
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
