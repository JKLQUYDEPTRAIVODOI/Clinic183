import React from 'react';
import { Descriptions, Tag } from 'antd';

const MedicalHistoryDetail = ({ record }) => {
  if (!record) return null;

  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Patient Name">
        {record.patient_name}
      </Descriptions.Item>
      <Descriptions.Item label="Doctor Name">
        {record.doctor_name}
      </Descriptions.Item>
      <Descriptions.Item label="Appointment Date">
        {new Date(record.appointment_date).toLocaleDateString()}
      </Descriptions.Item>
      <Descriptions.Item label="Appointment Time">
        {record.appointment_time.substring(0, 5)}
      </Descriptions.Item>
      <Descriptions.Item label="Diagnosis">
        {record.diagnosis}
      </Descriptions.Item>
      <Descriptions.Item label="Notes">
        {record.notes || 'No notes'}
      </Descriptions.Item>
      <Descriptions.Item label="Created At">
        {new Date(record.created_at).toLocaleString()}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default MedicalHistoryDetail; 