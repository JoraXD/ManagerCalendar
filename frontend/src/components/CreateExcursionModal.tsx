// CreateExcursionModal.tsx
// Modal window for creating a new excursion.
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { X } from 'lucide-react';
import { createExcursion, CreateExcursionData } from '../services/api';
import './CreateExcursionModal.css';

interface CreateExcursionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateExcursionModal: React.FC<CreateExcursionModalProps> = ({ open, onOpenChange }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateExcursionData>();

  const createExcursionMutation = useMutation(createExcursion, {
    onSuccess: () => {
      queryClient.invalidateQueries('excursions');
      reset();
      onOpenChange(false);
    }
  });

  const onSubmit = (data: CreateExcursionData) => {
    createExcursionMutation.mutate({ ...data, people: Number(data.people) });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Excursion</h2>
          <button onClick={() => onOpenChange(false)} className="close-button">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="excursion-form">
          <div className="form-group">
            <label htmlFor="assignedTo">Assigned To</label>
            <input id="assignedTo" {...register('assignedTo')} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input id="date" type="date" {...register('date', { required: true })} />
            </div>
            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input id="time" type="time" {...register('time', { required: true })} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="meetingPlace">Meeting Place</label>
            <input id="meetingPlace" {...register('meetingPlace')} />
          </div>
          <div className="form-group">
            <label htmlFor="route">Route</label>
            <input id="route" {...register('route')} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="people">People</label>
              <input id="people" type="number" {...register('people')} />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <input id="type" {...register('type')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group checkbox">
              <label>
                <input type="checkbox" {...register('lunch')} /> Lunch
              </label>
            </div>
            <div className="form-group checkbox">
              <label>
                <input type="checkbox" {...register('masterClass')} /> Master Class
              </label>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => onOpenChange(false)} className="cancel-button">Cancel</button>
            <button type="submit" disabled={createExcursionMutation.isLoading} className="submit-button">
              {createExcursionMutation.isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExcursionModal;
