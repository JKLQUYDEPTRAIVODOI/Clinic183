import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import appointmentService from '../../services/appointmentService';

const { TextArea } = Input;

const MedicalHistoryForm = ({ record, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [appointments, setAppointments] = React.useState([]);

  React.useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentService.getAllAppointments();
        // Filter only completed appointments
        const completedAppointments = response.data.filter(
          (appointment) => appointment.status === 'completed'
        );
        setAppointments(completedAppointments);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  React.useEffect(() => {
    if (record) {
      form.setFieldsValue({
        appointment_id: record.appointment_id,
        diagnosis: record.diagnosis,
        notes: record.notes,
      });
    }
  }, [record, form]);

  const handleSubmit = async (values) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        appointment_id: undefined,
        diagnosis: '',
        notes: '',
      }}
    >
      <Form.Item
        name="appointment_id"
        label="Appointment"
        rules={[{ required: true, message: 'Please select an appointment' }]}
      >
        <Select placeholder="Select an appointment">
          {appointments.map((appointment) => (
            <Select.Option key={appointment.id} value={appointment.id}>
              {`${appointment.patient_name} - ${new Date(
                appointment.appointment_date
              ).toLocaleDateString()} ${appointment.appointment_time.substring(
                0,
                5
              )}`}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="diagnosis"
        label="Diagnosis"
        rules={[{ required: true, message: 'Please enter the diagnosis' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item name="notes" label="Notes">
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {record ? 'Update' : 'Create'}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default MedicalHistoryForm; 