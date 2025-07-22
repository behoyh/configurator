import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Space, Card, notification, Progress } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import StatusStream from '../../utils/StatusStream';
import getGrpcUrl from '../../utils/get-grpc-url';
const { StatusRequest } = require('../../grpc-api/status_pb');

const { Option } = Select;

const SweepConfigurator = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [parameters, setParameters] = useState([]);
    const [spec, setSpec] = useState({});
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');
    const [stream, setStream] = useState(null);
    const [configs, setConfigs] = useState([]);

    useEffect(() => {
        const statusStream = new StatusStream(getGrpcUrl());
        setStream(statusStream);
        fetchConfigs();

        return () => {
            statusStream.cancel();
        };
    }, []);

    const fetchConfigs = async () => {
        try {
            const response = await axios.get('http://localhost:8000/configs');
            setConfigs(response.data);
        } catch (error) {
            notification.error({
                message: 'Failed to fetch configs',
                description: error.response?.data?.detail || 'An unexpected error occurred.',
            });
        }
    };

    const addParameter = () => {
        setParameters([...parameters, { key: '', type: 'float', values: '' }]);
    };

    const removeParameter = (index) => {
        const newParameters = [...parameters];
        newParameters.splice(index, 1);
        setParameters(newParameters);
    };

    const handleParameterChange = (index, field, value) => {
        const newParameters = [...parameters];
        newParameters[index][field] = value;
        setParameters(newParameters);
    };

    const onPreview = () => {
        const spec = {
            name,
            description,
            parameters: parameters.map(p => ({
                ...p,
                values: p.values.split(',').map(v => p.type === 'float' ? parseFloat(v) : v)
            }))
        };
        setSpec(spec);
    };

    useEffect(() => {
        onPreview();
    }, [name, description, parameters]);

    const onSave = async () => {
        const spec = {
            name,
            description,
            parameters: parameters.map(p => ({
                ...p,
                values: p.values.split(',').map(v => p.type === 'float' ? parseFloat(v) : v)
            }))
        };
        try {
            const response = await axios.post('http://localhost:8000/configs', spec);
            notification.success({
                message: 'Save Successful',
                description: `Configuration saved with ID: ${response.data.id}`,
            });
            fetchConfigs(); // Refresh the list after saving
        } catch (error) {
            notification.error({
                message: 'Save Failed',
                description: error.response?.data?.detail || 'An unexpected error occurred.',
            });
        }
    };

    const startStatusStream = () => {
        if (stream) {
            const request = new StatusRequest();
            request.setId('123'); 

            stream.start(
                request,
                ({ progress, status }) => {
                    setProgress(progress);
                    setStatus(status);
                },
                () => {
                    console.log('Stream ended');
                }
            );
        }
    };

    const onLoad = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8000/configs/${id}`);
            const config = response.data;
            setName(config.name);
            setDescription(config.description);
            setParameters(config.parameters.map(p => ({
                ...p,
                values: p.values.join(',')
            })));
        } catch (error) {
            notification.error({
                message: 'Failed to load config',
                description: error.response?.data?.detail || 'An unexpected error occurred.',
            });
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Card title="Saved Configurations">
                {configs.map(config => (
                    <div key={config.id} style={{ marginBottom: '10px' }}>
                        <Button onClick={() => onLoad(config.id)}>{config.name}</Button>
                    </div>
                ))}
            </Card>
            <Card title="Parameter Sweep Configurator" style={{ marginTop: '20px' }}>
                <Form autoComplete="off">
                    <Form.Item label="Sweep Name" required>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Description">
                        <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Form.Item>
                    {parameters.map((param, index) => (
                        <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Input
                                placeholder="Parameter Key"
                                value={param.key}
                                onChange={(e) => handleParameterChange(index, 'key', e.target.value)}
                            />
                            <Select
                                value={param.type}
                                onChange={(value) => handleParameterChange(index, 'type', value)}
                                style={{ width: 120 }}
                            >
                                <Option value="float">Float</Option>
                                <Option value="enum">Enum</Option>
                            </Select>
                            <Input
                                placeholder="Values (comma separated)"
                                value={param.values}
                                onChange={(e) => handleParameterChange(index, 'values', e.target.value)}
                            />
                            <MinusCircleOutlined onClick={() => removeParameter(index)} />
                        </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={addParameter} block icon={<PlusOutlined />}>
                            Add Parameter
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={onPreview}>
                            Preview
                        </Button>
                        <Button type="primary" onClick={onSave} style={{ marginLeft: '10px' }}>
                            Save
                        </Button>
                        <Button type="primary" onClick={startStatusStream} style={{ marginLeft: '10px' }}>
                            Start Status Stream
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card title="Live JSON Preview" style={{ marginTop: '20px' }}>
                <pre>{JSON.stringify(spec, null, 2)}</pre>
            </Card>
            <Card title="Status" style={{ marginTop: '20px' }}>
                <Progress percent={progress} />
                <p>{status}</p>
            </Card>
        </div>
    );
};

export default SweepConfigurator;
