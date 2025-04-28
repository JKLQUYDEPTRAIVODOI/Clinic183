import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import medicalRecordService from '../../services/medicalRecordService';
import MedicalHistoryForm from './MedicalHistoryForm';
import MedicalHistoryDetail from './MedicalHistoryDetail';

const MedicalHistoryList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'

  // Fetch medical records
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await medicalRecordService.getAllMedicalRecords();
      setRecords(response.data);
    } catch (error) {
      message.error('Failed to fetch medical records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Handle create new record
  const handleCreate = () => {
    setFormMode('create');
    setSelectedRecord(null);
    setIsModalVisible(true);
  };

  // Handle edit record
  const handleEdit = (record) => {
    setFormMode('edit');
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  // Handle view record details
  const handleView = (record) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  // Handle delete record
  const handleDelete = async (id) => {
    try {
      await medicalRecordService.deleteMedicalRecord(id);
      message.success('Medical record deleted successfully');
      fetchRecords();
    } catch (error) {
      message.error('Failed to delete medical record');
    }
  };

  // Handle form submit
  const handleFormSubmit = async (values) => {
    try {
      if (formMode === 'create') {
        await medicalRecordService.createMedicalRecord(values);
        message.success('Medical record created successfully');
      } else {
        await medicalRecordService.updateMedicalRecord(selectedRecord.id, values);
        message.success('Medical record updated successfully');
      }
      setIsModalVisible(false);
      fetchRecords();
    } catch (error) {
      message.error('Failed to save medical record');
    }
  };

  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'patient_name',
      key: 'patient_name',
    },
    {
      title: 'Doctor Name',
      dataIndex: 'doctor_name',
      key: 'doctor_name',
    },
    {
      title: 'Appointment Date',
      dataIndex: 'appointment_date',
      key: 'appointment_date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Appointment Time',
      dataIndex: 'appointment_time',
      key: 'appointment_time',
      render: (time) => time.substring(0, 5),
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleCreate}>
          Create New Medical Record
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={records}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={formMode === 'create' ? 'Create Medical Record' : 'Edit Medical Record'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <MedicalHistoryForm
          record={selectedRecord}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalVisible(false)}
        />
      </Modal>

      <Modal
        title="Medical Record Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        <MedicalHistoryDetail record={selectedRecord} />
      </Modal>
    </div>
  );
};

export default MedicalHistoryList; 