import { DAGNode, DAGEdge, WorkflowCatalogItem, WorkflowExecutionResult } from '../types/architecture';
import { INITIAL_NODES, INITIAL_EDGES } from './blueprintData';

export const WORKFLOW_CATALOG: WorkflowCatalogItem[] = [
  {
    id: 'wf-enterprise-mesh',
    name: 'Enterprise Data Ingestion & Governance Pipeline',
    description: 'Mission-critical CDC ingestion, format-preserving vault tokenization, Great Expectations assertions, and Curated Parquet Lakehouse storage.',
    category: 'Integration',
    environment: 'Production',
    nodes: INITIAL_NODES,
    edges: INITIAL_EDGES.map(e => ({
      ...e,
      connectorType: e.id === 'edge-1-2' ? 'postgres' : e.id === 'edge-2-3' ? 'grpc' : e.id === 'edge-4-5' ? 'kafka' : 'generic',
      connectorProtocol: 'mTLS 1.3 Strict',
      connectorStatus: 'connected',
      connectorName: e.id === 'edge-1-2' ? 'PostgreSQL CDC Connector' : e.id === 'edge-4-5' ? 'Kafka Event Pipe' : 'gRPC Enclave Link'
    })),
    defaultResults: {
      runId: 'run-ent-882194',
      workflowId: 'wf-enterprise-mesh',
      workflowName: 'Enterprise Data Ingestion & Governance Pipeline',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      durationSeconds: 1.48,
      recordsProcessed: 54200,
      throughput: '36.6 MB/s (24,200 rec/s)',
      errorRate: '0.00%',
      totalBytes: '18.4 MB',
      costEstimate: '$0.0038 / run',
      complianceStatus: 'SOC2 / HIPAA / ISO 27001 Compliant',
      stepResults: [
        {
          nodeId: 'node-1',
          nodeName: 'Source Dataset A (Structured)',
          category: 'source',
          status: 'completed',
          durationMs: 142,
          recordsIn: 0,
          recordsOut: 54200,
          throughput: '24,200 rec/s',
          statusMessage: 'CDC partition batch read committed without offset lag.'
        },
        {
          nodeId: 'node-2',
          nodeName: 'Vault Security Tokenizer',
          category: 'guardrail',
          status: 'completed',
          durationMs: 198,
          recordsIn: 54200,
          recordsOut: 54200,
          throughput: '23,800 rec/s',
          statusMessage: '100% PII fields anonymized using FF3-1 BPS tokenization.'
        },
        {
          nodeId: 'node-3',
          nodeName: 'Data Quality & Contract Gate',
          category: 'guardrail',
          status: 'completed',
          durationMs: 88,
          recordsIn: 54200,
          recordsOut: 54200,
          throughput: '26,100 rec/s',
          statusMessage: 'All 4/4 Great Expectations assertions passed with 0 nulls.'
        },
        {
          nodeId: 'node-4',
          nodeName: 'Broadcasting Metadata Joiner',
          category: 'transform',
          status: 'completed',
          durationMs: 230,
          recordsIn: 54200,
          recordsOut: 54200,
          throughput: '21,900 rec/s',
          statusMessage: 'Hash broadcast join with Master Metadata Store finished in 230ms.'
        },
        {
          nodeId: 'node-5',
          nodeName: 'Confidential Compute Enclave',
          category: 'transform',
          status: 'completed',
          durationMs: 310,
          recordsIn: 54200,
          recordsOut: 54200,
          throughput: '20,400 rec/s',
          statusMessage: 'Zero memory leakage detected under AMD SEV hardware enclave.'
        },
        {
          nodeId: 'node-6',
          nodeName: 'Curated Analytics Repository',
          category: 'sink',
          status: 'completed',
          durationMs: 165,
          recordsIn: 54200,
          recordsOut: 54200,
          throughput: '25,300 rec/s',
          statusMessage: 'ACID transaction committed. Partitioned Parquet written with zstd.'
        }
      ],
      connectorResults: [
        {
          edgeId: 'edge-1-2',
          connectorName: 'PostgreSQL Debezium CDC Connector',
          connectorType: 'postgres',
          sourceNodeName: 'Source Dataset A (Structured)',
          targetNodeName: 'Vault Security Tokenizer',
          protocol: 'mTLS 1.3 / WAL Replication',
          status: 'handshake_verified',
          latencyMs: 3.2,
          bytesTransferred: '18.4 MB',
          securityCipher: 'TLS_AES_256_GCM_SHA384'
        },
        {
          edgeId: 'edge-2-3',
          connectorName: 'Enclave Inter-Process gRPC Pipe',
          connectorType: 'grpc',
          sourceNodeName: 'Vault Security Tokenizer',
          targetNodeName: 'Data Quality & Contract Gate',
          protocol: 'gRPC Protobuf Zero-Copy',
          status: 'handshake_verified',
          latencyMs: 1.1,
          bytesTransferred: '17.9 MB',
          securityCipher: 'Hardware Memory RAMFS Pipe'
        },
        {
          edgeId: 'edge-4-5',
          connectorName: 'Kafka High-Throughput Event Pipe',
          connectorType: 'kafka',
          sourceNodeName: 'Broadcasting Metadata Joiner',
          targetNodeName: 'Confidential Compute Enclave',
          protocol: 'Kafka Wire Protocol 3.6 + SASL/SCRAM',
          status: 'streaming',
          latencyMs: 2.4,
          bytesTransferred: '18.1 MB',
          securityCipher: 'AES-256-GCM Wire Encryption'
        }
      ],
      outputPayloadSample: [
        {
          record_id: 'a9b2c3d4-e5f6-7890-abcd-ef0123456789',
          entity_code: 'CORP_ENT_0912',
          transaction_amt: 14850.50,
          customer_token: 'tok_ff31_98a76bc388',
          quality_score: 1.0,
          validation_status: 'PASSED',
          enclave_attestation: 'AMD-SEV-HW-VERIFIED',
          processed_at: new Date().toISOString()
        },
        {
          record_id: 'b1c2d3e4-f5a6-7890-bcde-fa1234567890',
          entity_code: 'RETAIL_DIV_4102',
          transaction_amt: 832.15,
          customer_token: 'tok_ff31_12d45ee991',
          quality_score: 1.0,
          validation_status: 'PASSED',
          enclave_attestation: 'AMD-SEV-HW-VERIFIED',
          processed_at: new Date().toISOString()
        },
        {
          record_id: 'c2d3e4f5-a6b7-8901-cdef-ab2345678901',
          entity_code: 'GLOBAL_SETTLE_77',
          transaction_amt: 95400.00,
          customer_token: 'tok_ff31_77a91bb220',
          quality_score: 1.0,
          validation_status: 'PASSED',
          enclave_attestation: 'AMD-SEV-HW-VERIFIED',
          processed_at: new Date().toISOString()
        }
      ],
      auditLogs: [
        {
          timestamp: '10:42:01.014',
          level: 'INFO',
          component: 'DAG_DISPATCH',
          message: 'Workflow "Enterprise Data Ingestion & Governance Pipeline" initialized on worker pool [pool-az1-prod].'
        },
        {
          timestamp: '10:42:01.156',
          level: 'INFO',
          component: 'CONNECTOR_POSTGRES',
          message: 'PostgreSQL CDC connector handshake verified. Ingesting WAL partition [lsn=0/19B820].'
        },
        {
          timestamp: '10:42:01.354',
          level: 'AUDIT',
          component: 'VAULT_TOKENIZER',
          message: 'Vault BPS tokenization completed for 54,200 records. Zero plaintext customer PII persisted.'
        },
        {
          timestamp: '10:42:01.442',
          level: 'SUCCESS',
          component: 'QUALITY_GATE',
          message: 'Contract validation successful. Zero schema violations. Quality threshold: 100% compliant.'
        },
        {
          timestamp: '10:42:02.182',
          level: 'AUDIT',
          component: 'CONFIDENTIAL_ENCLAVE',
          message: 'Attestation report signed with Hardware Root of Trust. Zero side-channel leaks detected.'
        },
        {
          timestamp: '10:42:02.494',
          level: 'SUCCESS',
          component: 'LAKEHOUSE_SINK',
          message: 'Delta commit snapshot #4829 successfully written to S3 Curated bucket. Duration 1.48s.'
        }
      ]
    }
  },
  {
    id: 'wf-fraud-scoring',
    name: 'Real-Time Fraud Detection & Scoring Pipeline',
    description: 'Sub-5ms low latency streaming workflow linking live Kafka credit card swipes, feature store joins, Gemini LLM risk guardrails, and automated quarantine sink.',
    category: 'Fraud & Risk',
    environment: 'Production',
    nodes: [
      {
        id: 'fraud-node-1',
        name: 'Kafka Payment Stream (Ingest)',
        category: 'source',
        typeLabel: 'Apache Kafka Ingestion',
        description: 'Sub-millisecond payment transaction event ingest from multi-region Kafka cluster.',
        position: { x: 40, y: 160 },
        status: 'completed',
        inputs: [],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[0].config, cpuAllocation: '4.0 vCPU', memoryAllocation: '8.0 GiB' }
      },
      {
        id: 'fraud-node-2',
        name: 'Feature Store Hot-Joiner',
        category: 'transform',
        typeLabel: 'Redis Feature Cache Join',
        description: 'Joins 90-day velocity metrics and IP geolocation features in <1.2ms via Redis cluster.',
        position: { x: 380, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[1].config, cpuAllocation: '8.0 vCPU', memoryAllocation: '16.0 GiB' }
      },
      {
        id: 'fraud-node-3',
        name: 'AI Risk Scorer & Guardrail',
        category: 'guardrail',
        typeLabel: 'Gemini Risk Inference Engine',
        description: 'Evaluates transaction fraud probability and enforces strict anti-money laundering policies.',
        position: { x: 720, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[2].config, cpuAllocation: '8.0 vCPU', memoryAllocation: '16.0 GiB' }
      },
      {
        id: 'fraud-node-4',
        name: 'Automated Decision Router',
        category: 'control',
        typeLabel: 'Dynamic Traffic Splitter',
        description: 'Splits traffic based on risk score: <0.20 auto-approve, >=0.75 immediate quarantine.',
        position: { x: 1060, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1', 'out-2'],
        config: { ...INITIAL_NODES[3].config }
      },
      {
        id: 'fraud-node-5',
        name: 'Quarantine & Fraud Alert Sink',
        category: 'sink',
        typeLabel: 'Security SOC Alert Sink',
        description: 'Dispatches real-time webhooks to fraud investigators and drops transaction into isolated cold bucket.',
        position: { x: 1400, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: [],
        config: { ...INITIAL_NODES[4].config }
      }
    ],
    edges: [
      {
        id: 'fraud-edge-1-2',
        source: 'fraud-node-1',
        target: 'fraud-node-2',
        label: 'Kafka Protocol (34,000 msg/s)',
        dataFlowRate: '34,000 msg/s',
        connectorType: 'kafka',
        connectorProtocol: 'Kafka SASL_SSL 3.6',
        connectorStatus: 'streaming',
        connectorName: 'Kafka Topic [payments.v2]'
      },
      {
        id: 'fraud-edge-2-3',
        source: 'fraud-node-2',
        target: 'fraud-node-3',
        label: 'gRPC Enclave Stream',
        dataFlowRate: '34,000 msg/s',
        connectorType: 'grpc',
        connectorProtocol: 'gRPC Zero-Copy TLS',
        connectorStatus: 'connected',
        connectorName: 'Feature Vector Pipe'
      },
      {
        id: 'fraud-edge-3-4',
        source: 'fraud-node-3',
        target: 'fraud-node-4',
        label: 'Risk Scored Payloads',
        dataFlowRate: '34,000 msg/s',
        connectorType: 'gemini',
        connectorProtocol: 'mTLS 1.3 Strict',
        connectorStatus: 'connected',
        connectorName: 'Gemini AI Guardrail Link'
      },
      {
        id: 'fraud-edge-4-5',
        source: 'fraud-node-4',
        target: 'fraud-node-5',
        label: 'Quarantine Dispatches',
        dataFlowRate: '128 alerts/s',
        connectorType: 'rest',
        connectorProtocol: 'HTTPS REST Webhook',
        connectorStatus: 'connected',
        connectorName: 'Fraud SOC Webhook Integration'
      }
    ],
    defaultResults: {
      runId: 'run-frd-771920',
      workflowId: 'wf-fraud-scoring',
      workflowName: 'Real-Time Fraud Detection & Scoring Pipeline',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      durationSeconds: 0.92,
      recordsProcessed: 68000,
      throughput: '42.1 MB/s (34,000 rec/s)',
      errorRate: '0.00%',
      totalBytes: '22.8 MB',
      costEstimate: '$0.0029 / run',
      complianceStatus: 'PCI-DSS Level 1 / SOC2 Compliant',
      stepResults: [
        {
          nodeId: 'fraud-node-1',
          nodeName: 'Kafka Payment Stream (Ingest)',
          category: 'source',
          status: 'completed',
          durationMs: 82,
          recordsIn: 0,
          recordsOut: 68000,
          throughput: '34,000 rec/s',
          statusMessage: 'Consumed 68k transactions across 16 Kafka partitions with zero lag.'
        },
        {
          nodeId: 'fraud-node-2',
          nodeName: 'Feature Store Hot-Joiner',
          category: 'transform',
          status: 'completed',
          durationMs: 110,
          recordsIn: 68000,
          recordsOut: 68000,
          throughput: '34,000 rec/s',
          statusMessage: 'Joined 90-day velocity aggregates from Redis in avg 1.1ms latency.'
        },
        {
          nodeId: 'fraud-node-3',
          nodeName: 'AI Risk Scorer & Guardrail',
          category: 'guardrail',
          status: 'completed',
          durationMs: 240,
          recordsIn: 68000,
          recordsOut: 68000,
          throughput: '34,000 rec/s',
          statusMessage: 'Inferred risk probabilities. Flagged 24 anomalous velocity bursts.'
        },
        {
          nodeId: 'fraud-node-4',
          nodeName: 'Automated Decision Router',
          category: 'control',
          status: 'completed',
          durationMs: 45,
          recordsIn: 68000,
          recordsOut: 68000,
          throughput: '34,000 rec/s',
          statusMessage: 'Routed 67,976 approved to settlement; 24 flagged to isolation.'
        },
        {
          nodeId: 'fraud-node-5',
          nodeName: 'Quarantine & Fraud Alert Sink',
          category: 'sink',
          status: 'completed',
          durationMs: 95,
          recordsIn: 24,
          recordsOut: 24,
          throughput: '128 alerts/s',
          statusMessage: 'High-priority webhook delivered to SOC Fraud Operations queue.'
        }
      ],
      connectorResults: [
        {
          edgeId: 'fraud-edge-1-2',
          connectorName: 'Kafka Topic [payments.v2]',
          connectorType: 'kafka',
          sourceNodeName: 'Kafka Payment Stream (Ingest)',
          targetNodeName: 'Feature Store Hot-Joiner',
          protocol: 'Kafka SASL_SSL 3.6',
          status: 'streaming',
          latencyMs: 1.8,
          bytesTransferred: '22.8 MB',
          securityCipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM'
        },
        {
          edgeId: 'fraud-edge-3-4',
          connectorName: 'Gemini AI Guardrail Link',
          connectorType: 'gemini',
          sourceNodeName: 'AI Risk Scorer & Guardrail',
          targetNodeName: 'Automated Decision Router',
          protocol: 'mTLS 1.3 Strict',
          status: 'handshake_verified',
          latencyMs: 2.1,
          bytesTransferred: '19.4 MB',
          securityCipher: 'AES-256-GCM'
        }
      ],
      outputPayloadSample: [
        {
          tx_id: 'tx_card_9981204',
          cardholder_masked: '4111-XXXX-XXXX-8912',
          amount: 2850.00,
          currency: 'USD',
          merchant: 'HighEnd Jewelers London',
          risk_score: 0.94,
          decision: 'QUARANTINE_FLAGGED',
          reasons: ['Velocity anomaly: 4 tx in 2 min', 'Country mismatch: US card in UK'],
          action_taken: 'HOLD_AND_ALERT_SOC'
        },
        {
          tx_id: 'tx_card_9981205',
          cardholder_masked: '5500-XXXX-XXXX-3419',
          amount: 14.50,
          currency: 'USD',
          merchant: 'Subway Sandwich San Francisco',
          risk_score: 0.02,
          decision: 'AUTO_APPROVED',
          reasons: ['Standard habitual location', 'Consistent device fingerprint'],
          action_taken: 'SETTLED'
        }
      ],
      auditLogs: [
        {
          timestamp: '10:44:00.100',
          level: 'INFO',
          component: 'KAFKA_INGEST',
          message: 'Connected to Kafka payment brokers: broker-01.fin.internal:9092.'
        },
        {
          timestamp: '10:44:00.410',
          level: 'AUDIT',
          component: 'GEMINI_RISK',
          message: 'Zero latency anomalies in neural inference batch. 68k transactions scored.'
        },
        {
          timestamp: '10:44:00.920',
          level: 'SUCCESS',
          component: 'SOC_ROUTER',
          message: 'Dispatched 24 quarantine records with encrypted audit signatures.'
        }
      ]
    }
  },
  {
    id: 'wf-lakehouse-sync',
    name: 'Cross-Cloud Snowflake & Databricks Lakehouse Sync',
    description: 'Multi-cloud enterprise data replication pipeline maintaining zero-drift bidirectional synchronization between Databricks Delta Lake, AWS S3 Apache Iceberg, and Snowflake Data Cloud.',
    category: 'Lakehouse',
    environment: 'Production',
    nodes: [
      {
        id: 'lake-node-1',
        name: 'Amazon S3 Raw Parquet Ingest',
        category: 'source',
        typeLabel: 'Object Storage Source',
        description: 'Streams partitioned raw Parquet files from AWS S3 private VPC bucket.',
        position: { x: 40, y: 160 },
        status: 'completed',
        inputs: [],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[0].config }
      },
      {
        id: 'lake-node-2',
        name: 'Schema Evolution & Drift Gate',
        category: 'guardrail',
        typeLabel: 'Avro/Parquet Schema Validator',
        description: 'Detects upstream schema alterations and blocks backward-incompatible column deletions.',
        position: { x: 380, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[2].config }
      },
      {
        id: 'lake-node-3',
        name: 'Databricks Delta Lake Engine',
        category: 'transform',
        typeLabel: 'Delta ACID Transaction Log',
        description: 'Compacts small files into optimized 128MB partitions and maintains commit history.',
        position: { x: 720, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[3].config }
      },
      {
        id: 'lake-node-4',
        name: 'Apache Iceberg Catalog Sync',
        category: 'transform',
        typeLabel: 'Open Table Format Bridge',
        description: 'Exposes snapshots to multi-engine query engines via REST Iceberg Catalog.',
        position: { x: 1060, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[4].config }
      },
      {
        id: 'lake-node-5',
        name: 'Snowflake Data Cloud Sink',
        category: 'sink',
        typeLabel: 'Snowflake External Table Sync',
        description: 'Synchronizes iceberg table metadata directly into Snowflake Analytics warehouse.',
        position: { x: 1400, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: [],
        config: { ...INITIAL_NODES[5].config }
      }
    ],
    edges: [
      {
        id: 'lake-edge-1-2',
        source: 'lake-node-1',
        target: 'lake-node-2',
        label: 'S3 Multipart Stream',
        dataFlowRate: '18,500 rec/s',
        connectorType: 's3',
        connectorProtocol: 'S3 SigV4 IAM mTLS',
        connectorStatus: 'connected',
        connectorName: 'AWS S3 Bucket Connector'
      },
      {
        id: 'lake-edge-2-3',
        source: 'lake-node-2',
        target: 'lake-node-3',
        label: 'Validated Streams',
        dataFlowRate: '18,500 rec/s',
        connectorType: 'databricks',
        connectorProtocol: 'Delta Sharing Protocol',
        connectorStatus: 'streaming',
        connectorName: 'Databricks Delta Link'
      },
      {
        id: 'lake-edge-3-4',
        source: 'lake-node-3',
        target: 'lake-node-4',
        label: 'Iceberg Snapshots',
        dataFlowRate: '18,500 rec/s',
        connectorType: 'generic',
        connectorProtocol: 'REST Iceberg Catalog v1',
        connectorStatus: 'connected',
        connectorName: 'Iceberg Metadata Bridge'
      },
      {
        id: 'lake-edge-4-5',
        source: 'lake-node-4',
        target: 'lake-node-5',
        label: 'Snowflake External Sync',
        dataFlowRate: '18,500 rec/s',
        connectorType: 'snowflake',
        connectorProtocol: 'Snowpipe Streaming API',
        connectorStatus: 'connected',
        connectorName: 'Snowflake Enterprise Connector'
      }
    ],
    defaultResults: {
      runId: 'run-lak-991204',
      workflowId: 'wf-lakehouse-sync',
      workflowName: 'Cross-Cloud Snowflake & Databricks Lakehouse Sync',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      durationSeconds: 1.85,
      recordsProcessed: 42000,
      throughput: '28.4 MB/s (18,500 rec/s)',
      errorRate: '0.00%',
      totalBytes: '34.2 MB',
      costEstimate: '$0.0045 / run',
      complianceStatus: 'Multi-Cloud SOC2 / ISO 27001',
      stepResults: [
        {
          nodeId: 'lake-node-1',
          nodeName: 'Amazon S3 Raw Parquet Ingest',
          category: 'source',
          status: 'completed',
          durationMs: 210,
          recordsIn: 0,
          recordsOut: 42000,
          throughput: '18,500 rec/s',
          statusMessage: 'Fetched 42k records from s3://prod-lakehouse-raw/2026/10/09/.'
        },
        {
          nodeId: 'lake-node-2',
          nodeName: 'Schema Evolution & Drift Gate',
          category: 'guardrail',
          status: 'completed',
          durationMs: 95,
          recordsIn: 42000,
          recordsOut: 42000,
          throughput: '18,500 rec/s',
          statusMessage: 'Verified 32 columns. No breaking type changes detected.'
        },
        {
          nodeId: 'lake-node-3',
          nodeName: 'Databricks Delta Lake Engine',
          category: 'transform',
          status: 'completed',
          durationMs: 380,
          recordsIn: 42000,
          recordsOut: 42000,
          throughput: '18,500 rec/s',
          statusMessage: 'Delta version 182 committed. Z-ordered by timestamp and customer_id.'
        },
        {
          nodeId: 'lake-node-4',
          nodeName: 'Apache Iceberg Catalog Sync',
          category: 'transform',
          status: 'completed',
          durationMs: 140,
          recordsIn: 42000,
          recordsOut: 42000,
          throughput: '18,500 rec/s',
          statusMessage: 'Updated Iceberg metadata pointer in AWS Glue Data Catalog.'
        },
        {
          nodeId: 'lake-node-5',
          nodeName: 'Snowflake Data Cloud Sink',
          category: 'sink',
          status: 'completed',
          durationMs: 220,
          recordsIn: 42000,
          recordsOut: 42000,
          throughput: '18,500 rec/s',
          statusMessage: 'Snowflake external table REFRESH successful. Zero compute lag.'
        }
      ],
      connectorResults: [
        {
          edgeId: 'lake-edge-1-2',
          connectorName: 'AWS S3 Bucket Connector',
          connectorType: 's3',
          sourceNodeName: 'Amazon S3 Raw Parquet Ingest',
          targetNodeName: 'Schema Evolution & Drift Gate',
          protocol: 'S3 SigV4 IAM mTLS',
          status: 'connected',
          latencyMs: 12.5,
          bytesTransferred: '34.2 MB',
          securityCipher: 'KMS-SSE-256'
        },
        {
          edgeId: 'lake-edge-4-5',
          connectorName: 'Snowflake Enterprise Connector',
          connectorType: 'snowflake',
          sourceNodeName: 'Apache Iceberg Catalog Sync',
          targetNodeName: 'Snowflake Data Cloud Sink',
          protocol: 'Snowpipe Streaming API',
          status: 'connected',
          latencyMs: 14.8,
          bytesTransferred: '34.2 MB',
          securityCipher: 'TLS 1.3 AES-256-GCM'
        }
      ],
      outputPayloadSample: [
        {
          lake_partition_id: 'part_20261009_001',
          delta_version: 182,
          iceberg_snapshot_id: 891284792147120,
          snowflake_table: 'ANALYTICS_DB.PUBLIC.GLOBAL_EVENTS_ICEBERG',
          records_synced: 42000,
          sync_lag_ms: 18,
          status: 'SYNCHRONIZED'
        }
      ],
      auditLogs: [
        {
          timestamp: '10:46:12.010',
          level: 'INFO',
          component: 'S3_INGEST',
          message: 'Read AWS S3 bucket objects with IAM role: arn:aws:iam::123456789:role/LakehouseSync'
        },
        {
          timestamp: '10:46:13.410',
          level: 'SUCCESS',
          component: 'DELTA_LAKE',
          message: 'Delta log committed without write conflict.'
        },
        {
          timestamp: '10:46:13.850',
          level: 'SUCCESS',
          component: 'SNOWFLAKE_SINK',
          message: 'Snowflake catalog metadata refreshed. Query engine active.'
        }
      ]
    }
  },
  {
    id: 'wf-hipaa-telemetry',
    name: 'HIPAA Patient Telemetry & PII De-identification',
    description: 'Compliant clinical health pipeline ingesting HL7/FHIR patient vitals, tokenizing medical record numbers (MRN), scrubbing clinical notes, and archiving into immutable cold storage.',
    category: 'Healthcare / HIPAA',
    environment: 'Production',
    nodes: [
      {
        id: 'hipaa-node-1',
        name: 'HL7 / FHIR Gateway (Ingest)',
        category: 'source',
        typeLabel: 'FHIR Restful API Gateway',
        description: 'Ingests real-time EHR patient observation bundles and vital monitors.',
        position: { x: 40, y: 160 },
        status: 'completed',
        inputs: [],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[0].config }
      },
      {
        id: 'hipaa-node-2',
        name: 'HIPAA De-identification Tokenizer',
        category: 'guardrail',
        typeLabel: 'Safe Harbor 18-Identifier Scrubber',
        description: 'Replaces patient names, MRN, SSN, and DOB with irreversible surrogate tokens.',
        position: { x: 380, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[1].config }
      },
      {
        id: 'hipaa-node-3',
        name: 'Clinical Outlier Filter',
        category: 'transform',
        typeLabel: 'Telemetry Sensor Anomaly Check',
        description: 'Identifies faulty pulse oximeter and blood pressure sensor spikes.',
        position: { x: 720, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[2].config }
      },
      {
        id: 'hipaa-node-4',
        name: 'Confidential Research Enclave',
        category: 'transform',
        typeLabel: 'Hardware Memory Sandbox',
        description: 'Executes cohort aggregations inside AMD SEV encrypted hardware enclaves.',
        position: { x: 1060, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[4].config }
      },
      {
        id: 'hipaa-node-5',
        name: 'WORM Immutable Archive',
        category: 'sink',
        typeLabel: 'HIPAA Compliant Cold Store',
        description: 'Writes 7-year retention immutable WORM Parquet records with cryptographic Merkle proof.',
        position: { x: 1400, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: [],
        config: { ...INITIAL_NODES[5].config }
      }
    ],
    edges: [
      {
        id: 'hipaa-edge-1-2',
        source: 'hipaa-node-1',
        target: 'hipaa-node-2',
        label: 'FHIR Bundles (mTLS 1.3)',
        dataFlowRate: '12,400 rec/s',
        connectorType: 'rest',
        connectorProtocol: 'HTTPS FHIR v4 mTLS',
        connectorStatus: 'connected',
        connectorName: 'FHIR Clinical Gateway'
      },
      {
        id: 'hipaa-edge-2-3',
        source: 'hipaa-node-2',
        target: 'hipaa-node-3',
        label: 'Tokenized Records',
        dataFlowRate: '12,400 rec/s',
        connectorType: 'grpc',
        connectorProtocol: 'gRPC Mutual TLS',
        connectorStatus: 'connected',
        connectorName: 'De-identified Stream'
      },
      {
        id: 'hipaa-edge-3-4',
        source: 'hipaa-node-3',
        target: 'hipaa-node-4',
        label: 'Clean Vitals Feed',
        dataFlowRate: '12,400 rec/s',
        connectorType: 'generic',
        connectorProtocol: 'Encrypted Shared Ring',
        connectorStatus: 'connected',
        connectorName: 'Enclave Interconnect'
      },
      {
        id: 'hipaa-edge-4-5',
        source: 'hipaa-node-4',
        target: 'hipaa-node-5',
        label: 'WORM Archive Batches',
        dataFlowRate: '12,400 rec/s',
        connectorType: 's3',
        connectorProtocol: 'S3 ObjectLock WORM Protocol',
        connectorStatus: 'connected',
        connectorName: 'WORM Storage Connector'
      }
    ],
    defaultResults: {
      runId: 'run-hip-102938',
      workflowId: 'wf-hipaa-telemetry',
      workflowName: 'HIPAA Patient Telemetry & PII De-identification',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      durationSeconds: 1.15,
      recordsProcessed: 28400,
      throughput: '19.2 MB/s (12,400 rec/s)',
      errorRate: '0.00%',
      totalBytes: '14.6 MB',
      costEstimate: '$0.0022 / run',
      complianceStatus: 'HIPAA Security Rule / HITECH / SOC2 Type II Certified',
      stepResults: [
        {
          nodeId: 'hipaa-node-1',
          nodeName: 'HL7 / FHIR Gateway (Ingest)',
          category: 'source',
          status: 'completed',
          durationMs: 140,
          recordsIn: 0,
          recordsOut: 28400,
          throughput: '12,400 rec/s',
          statusMessage: 'Ingested 28,400 patient observation telemetry resources.'
        },
        {
          nodeId: 'hipaa-node-2',
          nodeName: 'HIPAA De-identification Tokenizer',
          category: 'guardrail',
          status: 'completed',
          durationMs: 290,
          recordsIn: 28400,
          recordsOut: 28400,
          throughput: '12,400 rec/s',
          statusMessage: 'Zero Safe Harbor 18-identifiers left unmasked. 100% compliant.'
        },
        {
          nodeId: 'hipaa-node-3',
          nodeName: 'Clinical Outlier Filter',
          category: 'transform',
          status: 'completed',
          durationMs: 80,
          recordsIn: 28400,
          recordsOut: 28400,
          throughput: '12,400 rec/s',
          statusMessage: 'Filtered 14 disconnected sensor artifacts.'
        },
        {
          nodeId: 'hipaa-node-4',
          nodeName: 'Confidential Research Enclave',
          category: 'transform',
          status: 'completed',
          durationMs: 210,
          recordsIn: 28400,
          recordsOut: 28400,
          throughput: '12,400 rec/s',
          statusMessage: 'Aggregated clinical cohorts in hardware enclave.'
        },
        {
          nodeId: 'hipaa-node-5',
          nodeName: 'WORM Immutable Archive',
          category: 'sink',
          status: 'completed',
          durationMs: 180,
          recordsIn: 28400,
          recordsOut: 28400,
          throughput: '12,400 rec/s',
          statusMessage: 'Committed WORM immutable object lock with SHA-256 Merkle root.'
        }
      ],
      connectorResults: [
        {
          edgeId: 'hipaa-edge-1-2',
          connectorName: 'FHIR Clinical Gateway',
          connectorType: 'rest',
          sourceNodeName: 'HL7 / FHIR Gateway (Ingest)',
          targetNodeName: 'HIPAA De-identification Tokenizer',
          protocol: 'HTTPS FHIR v4 mTLS',
          status: 'handshake_verified',
          latencyMs: 2.9,
          bytesTransferred: '14.6 MB',
          securityCipher: 'TLS_AES_256_GCM_SHA384'
        },
        {
          edgeId: 'hipaa-edge-4-5',
          connectorName: 'WORM Storage Connector',
          connectorType: 's3',
          sourceNodeName: 'Confidential Research Enclave',
          targetNodeName: 'WORM Immutable Archive',
          protocol: 'S3 ObjectLock WORM Protocol',
          status: 'connected',
          latencyMs: 8.4,
          bytesTransferred: '14.2 MB',
          securityCipher: 'AES-256-GCM / KMS Managed Key'
        }
      ],
      outputPayloadSample: [
        {
          patient_surrogate_id: 'anon_mrn_77201948b',
          observation_code: '8867-4',
          observation_name: 'Heart Rate',
          value: 74,
          unit: '/min',
          age_cohort: '45-54',
          geographic_zip3: '941XX',
          de_id_certification: 'SAFE_HARBOR_18_CERTIFIED',
          retained_until: '2033-10-09'
        }
      ],
      auditLogs: [
        {
          timestamp: '10:48:02.012',
          level: 'AUDIT',
          component: 'FHIR_GATEWAY',
          message: 'Client cert validated: CN=Hospital-Cluster-04.health.internal.'
        },
        {
          timestamp: '10:48:02.440',
          level: 'AUDIT',
          component: 'DE_ID_SCRUBBER',
          message: 'HIPAA expert determination rule evaluated: PII re-identification risk < 0.0001%.'
        },
        {
          timestamp: '10:48:03.160',
          level: 'SUCCESS',
          component: 'WORM_STORE',
          message: 'Object lock active. Immutability guaranteed for 2555 days.'
        }
      ]
    }
  },
  {
    id: 'wf-genai-rag',
    name: 'GenAI RAG Knowledge Graph & Semantic Vector Index',
    description: 'Enterprise generative AI retrieval pipeline chunking PDF policy documents, invoking Google Gemini embedding model with hallucination guardrails, and indexing into Neo4j graph & Pinecone vector stores.',
    category: 'GenAI',
    environment: 'Production',
    nodes: [
      {
        id: 'rag-node-1',
        name: 'Enterprise Docs & Wiki Ingest',
        category: 'source',
        typeLabel: 'Document Corpus Connector',
        description: 'Ingests confidential PDF, Markdown, and Confluence corporate documents.',
        position: { x: 40, y: 160 },
        status: 'completed',
        inputs: [],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[0].config }
      },
      {
        id: 'rag-node-2',
        name: 'Parser, OCR & Smart Chunker',
        category: 'transform',
        typeLabel: 'Semantic Boundary Splitter',
        description: 'Extracts tables and splits text using recursive 512-token overlap windows.',
        position: { x: 380, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[1].config }
      },
      {
        id: 'rag-node-3',
        name: 'Gemini Embedding & Guardrail',
        category: 'guardrail',
        typeLabel: 'Google Gemini Pro Vectors',
        description: 'Generates 768-dim normalized embeddings and sanitizes toxic or prompt-injection text.',
        position: { x: 720, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[2].config }
      },
      {
        id: 'rag-node-4',
        name: 'Entity Knowledge Graph Extractor',
        category: 'transform',
        typeLabel: 'Entity-Relation Triples Parser',
        description: 'Extracts nodes & edges connecting enterprise acronyms, systems, and owners.',
        position: { x: 1060, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[3].config }
      },
      {
        id: 'rag-node-5',
        name: 'Hybrid Graph & Vector Sink',
        category: 'sink',
        typeLabel: 'Neo4j + Vector Index Sink',
        description: 'Commits vectors into Pinecone HNSW index and graph triples into Neo4j cluster.',
        position: { x: 1400, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: [],
        config: { ...INITIAL_NODES[5].config }
      }
    ],
    edges: [
      {
        id: 'rag-edge-1-2',
        source: 'rag-node-1',
        target: 'rag-node-2',
        label: 'Raw Document Bundles',
        dataFlowRate: '8,400 docs/min',
        connectorType: 's3',
        connectorProtocol: 'S3 Multipart mTLS',
        connectorStatus: 'connected',
        connectorName: 'Document Object Store'
      },
      {
        id: 'rag-edge-2-3',
        source: 'rag-node-2',
        target: 'rag-node-3',
        label: 'Tokenized Text Chunks',
        dataFlowRate: '42,000 chunks/min',
        connectorType: 'grpc',
        connectorProtocol: 'gRPC Protobuf Pipe',
        connectorStatus: 'connected',
        connectorName: 'Chunk Streamer'
      },
      {
        id: 'rag-edge-3-4',
        source: 'rag-node-3',
        target: 'rag-node-4',
        label: 'Vector Embeddings',
        dataFlowRate: '42,000 chunks/min',
        connectorType: 'gemini',
        connectorProtocol: 'Google GenAI SDK Proxy',
        connectorStatus: 'streaming',
        connectorName: 'Gemini Embedding Connector'
      },
      {
        id: 'rag-edge-4-5',
        source: 'rag-node-4',
        target: 'rag-node-5',
        label: 'Graph Triples & Vectors',
        dataFlowRate: '42,000 nodes/min',
        connectorType: 'generic',
        connectorProtocol: 'Bolt Protocol + HNSW REST',
        connectorStatus: 'connected',
        connectorName: 'Neo4j / Pinecone Link'
      }
    ],
    defaultResults: {
      runId: 'run-rag-449102',
      workflowId: 'wf-genai-rag',
      workflowName: 'GenAI RAG Knowledge Graph & Semantic Vector Index',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      durationSeconds: 1.34,
      recordsProcessed: 42000,
      throughput: '24.1 MB/s (31,300 tokens/s)',
      errorRate: '0.00%',
      totalBytes: '16.8 MB',
      costEstimate: '$0.0051 / run',
      complianceStatus: 'OWASP Top 10 for LLM / ISO 42001 AI Compliant',
      stepResults: [
        {
          nodeId: 'rag-node-1',
          nodeName: 'Enterprise Docs & Wiki Ingest',
          category: 'source',
          status: 'completed',
          durationMs: 180,
          recordsIn: 0,
          recordsOut: 4200,
          throughput: '8,400 docs/min',
          statusMessage: 'Fetched 4,200 PDF and Markdown documentation pages.'
        },
        {
          nodeId: 'rag-node-2',
          nodeName: 'Parser, OCR & Smart Chunker',
          category: 'transform',
          status: 'completed',
          durationMs: 310,
          recordsIn: 4200,
          recordsOut: 42000,
          throughput: '42,000 chunks/min',
          statusMessage: 'Generated 42,000 semantic chunks with 64-token sliding overlap.'
        },
        {
          nodeId: 'rag-node-3',
          nodeName: 'Gemini Embedding & Guardrail',
          category: 'guardrail',
          status: 'completed',
          durationMs: 440,
          recordsIn: 42000,
          recordsOut: 42000,
          throughput: '31,300 tokens/s',
          statusMessage: '768-dimension embeddings generated. Prompt injection checks passed.'
        },
        {
          nodeId: 'rag-node-4',
          nodeName: 'Entity Knowledge Graph Extractor',
          category: 'transform',
          status: 'completed',
          durationMs: 180,
          recordsIn: 42000,
          recordsOut: 42000,
          throughput: '42,000 nodes/min',
          statusMessage: 'Extracted 12,480 subject-predicate-object knowledge graph triples.'
        },
        {
          nodeId: 'rag-node-5',
          nodeName: 'Hybrid Graph & Vector Sink',
          category: 'sink',
          status: 'completed',
          durationMs: 230,
          recordsIn: 42000,
          recordsOut: 42000,
          throughput: '42,000 nodes/min',
          statusMessage: 'Committed to Pinecone index [enterprise-rag-v3] and Neo4j graph.'
        }
      ],
      connectorResults: [
        {
          edgeId: 'rag-edge-3-4',
          connectorName: 'Gemini Embedding Connector',
          connectorType: 'gemini',
          sourceNodeName: 'Gemini Embedding & Guardrail',
          targetNodeName: 'Entity Knowledge Graph Extractor',
          protocol: 'Google GenAI SDK Proxy',
          status: 'streaming',
          latencyMs: 18.2,
          bytesTransferred: '16.8 MB',
          securityCipher: 'TLS 1.3 Strict'
        }
      ],
      outputPayloadSample: [
        {
          chunk_id: 'chk_doc_policy_882',
          document_source: 'Enterprise_Network_Security_Policy_v4.pdf',
          section: 'Section 4.2 - VPC Egress & Service Mesh Rules',
          token_count: 384,
          embedding_preview: [0.0418, -0.1982, 0.4419, 0.0812, '... 768 dims'],
          extracted_entities: ['mTLS 1.3', 'Envoy Mesh', 'ISO 27001'],
          index_status: 'COMMITTED_INDEXED'
        }
      ],
      auditLogs: [
        {
          timestamp: '10:50:11.020',
          level: 'INFO',
          component: 'DOC_INGEST',
          message: 'Parsed policy corpus. Extracted text from scanned PDF tables.'
        },
        {
          timestamp: '10:50:11.770',
          level: 'AUDIT',
          component: 'GEMINI_GUARDRAIL',
          message: 'Zero jailbreak strings detected. Embedding vectors normalized to L2 norm.'
        },
        {
          timestamp: '10:50:12.360',
          level: 'SUCCESS',
          component: 'HYBRID_SINK',
          message: 'Hybrid graph-vector index updated. Latency query benchmark: 11ms.'
        }
      ]
    }
  },
  {
    id: 'wf-ecommerce-settlement',
    name: 'E-Commerce Stripe Settlement & ERP Reconciliation',
    description: 'Financial ledger workflow synchronizing Stripe payments, foreign exchange rate currency normalization, multi-currency VAT tax calculations, and NetSuite ERP settlement.',
    category: 'FinTech',
    environment: 'Production',
    nodes: [
      {
        id: 'ecom-node-1',
        name: 'Stripe Webhook Gateway (Ingest)',
        category: 'source',
        typeLabel: 'Payment Gateway Webhook',
        description: 'Captures charge.succeeded and payout.paid events with signature verification.',
        position: { x: 40, y: 160 },
        status: 'completed',
        inputs: [],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[0].config }
      },
      {
        id: 'ecom-node-2',
        name: 'FX Currency & Tax Calculator',
        category: 'transform',
        typeLabel: 'Real-Time FX Rates Engine',
        description: 'Converts EUR, GBP, JPY to USD ledger base using Bloomberg fixing rates.',
        position: { x: 440, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[1].config }
      },
      {
        id: 'ecom-node-3',
        name: 'Double-Entry Ledger Gate',
        category: 'guardrail',
        typeLabel: 'Accounting Balancing Assertion',
        description: 'Guarantees Debits == Credits with zero cent rounding discrepancy.',
        position: { x: 840, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: ['out-1'],
        config: { ...INITIAL_NODES[2].config }
      },
      {
        id: 'ecom-node-4',
        name: 'NetSuite ERP Financial Sink',
        category: 'sink',
        typeLabel: 'Oracle NetSuite General Ledger',
        description: 'Posts balanced journal entries via SuiteTalk REST Web Services.',
        position: { x: 1240, y: 160 },
        status: 'completed',
        inputs: ['in-1'],
        outputs: [],
        config: { ...INITIAL_NODES[5].config }
      }
    ],
    edges: [
      {
        id: 'ecom-edge-1-2',
        source: 'ecom-node-1',
        target: 'ecom-node-2',
        label: 'Verified Webhook Payloads',
        dataFlowRate: '15,200 tx/min',
        connectorType: 'salesforce',
        connectorProtocol: 'HTTPS HMAC-SHA256 Webhook',
        connectorStatus: 'connected',
        connectorName: 'Stripe API Gateway'
      },
      {
        id: 'ecom-edge-2-3',
        source: 'ecom-node-2',
        target: 'ecom-node-3',
        label: 'Normalized Journals',
        dataFlowRate: '15,200 tx/min',
        connectorType: 'grpc',
        connectorProtocol: 'gRPC Internal Ledger Protocol',
        connectorStatus: 'connected',
        connectorName: 'FX Settlement Stream'
      },
      {
        id: 'ecom-edge-3-4',
        source: 'ecom-node-3',
        target: 'ecom-node-4',
        label: 'Balanced General Ledger',
        dataFlowRate: '15,200 tx/min',
        connectorType: 'rest',
        connectorProtocol: 'NetSuite SuiteTalk OAuth 2.0',
        connectorStatus: 'connected',
        connectorName: 'NetSuite ERP Connector'
      }
    ],
    defaultResults: {
      runId: 'run-fin-310842',
      workflowId: 'wf-ecommerce-settlement',
      workflowName: 'E-Commerce Stripe Settlement & ERP Reconciliation',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      durationSeconds: 0.88,
      recordsProcessed: 18500,
      throughput: '14.8 MB/s (15,200 tx/min)',
      errorRate: '0.00%',
      totalBytes: '9.2 MB',
      costEstimate: '$0.0019 / run',
      complianceStatus: 'SOX 404 / GAAP Compliant / PCI Level 1',
      stepResults: [
        {
          nodeId: 'ecom-node-1',
          nodeName: 'Stripe Webhook Gateway (Ingest)',
          category: 'source',
          status: 'completed',
          durationMs: 120,
          recordsIn: 0,
          recordsOut: 18500,
          throughput: '15,200 tx/min',
          statusMessage: '18,500 Stripe webhook events verified with HMAC secret.'
        },
        {
          nodeId: 'ecom-node-2',
          nodeName: 'FX Currency & Tax Calculator',
          category: 'transform',
          status: 'completed',
          durationMs: 220,
          recordsIn: 18500,
          recordsOut: 18500,
          throughput: '15,200 tx/min',
          statusMessage: 'Normalized 42 currencies to USD. Calculated multi-jurisdiction VAT.'
        },
        {
          nodeId: 'ecom-node-3',
          nodeName: 'Double-Entry Ledger Gate',
          category: 'guardrail',
          status: 'completed',
          durationMs: 90,
          recordsIn: 18500,
          recordsOut: 18500,
          throughput: '15,200 tx/min',
          statusMessage: 'Sum(Debits) == Sum(Credits) to the penny. Zero balancing variance.'
        },
        {
          nodeId: 'ecom-node-4',
          nodeName: 'NetSuite ERP Financial Sink',
          category: 'sink',
          status: 'completed',
          durationMs: 450,
          recordsIn: 18500,
          recordsOut: 18500,
          throughput: '15,200 tx/min',
          statusMessage: 'Posted 18,500 journal entries into NetSuite Fiscal Period 2026-10.'
        }
      ],
      connectorResults: [
        {
          edgeId: 'ecom-edge-1-2',
          connectorName: 'Stripe API Gateway',
          connectorType: 'salesforce',
          sourceNodeName: 'Stripe Webhook Gateway (Ingest)',
          targetNodeName: 'FX Currency & Tax Calculator',
          protocol: 'HTTPS HMAC-SHA256 Webhook',
          status: 'connected',
          latencyMs: 4.1,
          bytesTransferred: '9.2 MB',
          securityCipher: 'TLS 1.3 Strict'
        },
        {
          edgeId: 'ecom-edge-3-4',
          connectorName: 'NetSuite ERP Connector',
          connectorType: 'rest',
          sourceNodeName: 'Double-Entry Ledger Gate',
          targetNodeName: 'NetSuite ERP Financial Sink',
          protocol: 'NetSuite SuiteTalk OAuth 2.0',
          status: 'connected',
          latencyMs: 16.5,
          bytesTransferred: '8.9 MB',
          securityCipher: 'Mutual TLS 1.3'
        }
      ],
      outputPayloadSample: [
        {
          journal_entry_id: 'JE-2026-10-88192',
          source_event: 'ch_3N981240182_stripe',
          settlement_date: '2026-10-09',
          debit_account: '1010-Cash-Stripe-Clearing',
          credit_account: '4010-ECommerce-Gross-Revenue',
          gross_amount_usd: 129.00,
          stripe_fee_usd: 3.74,
          net_settled_usd: 125.26,
          reconciliation_status: 'BALANCED_POSTED'
        }
      ],
      auditLogs: [
        {
          timestamp: '10:52:00.010',
          level: 'INFO',
          component: 'STRIPE_GATEWAY',
          message: 'Stripe signature verified: v1=98bc... Timestamp within 300s window.'
        },
        {
          timestamp: '10:52:00.410',
          level: 'AUDIT',
          component: 'SOX_ASSERTION',
          message: 'Double-entry balancing theorem holds: Total variance = $0.0000.'
        },
        {
          timestamp: '10:52:00.880',
          level: 'SUCCESS',
          component: 'NETSUITE_POST',
          message: 'Batch journal transaction #88192 committed into General Ledger.'
        }
      ]
    }
  }
];

export interface ConnectorPreset {
  id: string;
  name: string;
  category: 'Streaming & Event' | 'Warehouse & Lakehouse' | 'SaaS & Enterprise APIs' | 'AI & Guardrails' | 'Databases & CDC';
  type: 'kafka' | 'snowflake' | 's3' | 'salesforce' | 'rest' | 'grpc' | 'gemini' | 'postgres' | 'databricks' | 'generic';
  description: string;
  protocol: string;
  defaultThroughput: string;
  authMethod: string;
  recommendedSources: string[];
  recommendedTargets: string[];
}

export const CONNECTOR_PRESETS: ConnectorPreset[] = [
  {
    id: 'conn-kafka',
    name: 'Apache Kafka Event Stream',
    category: 'Streaming & Event',
    type: 'kafka',
    description: 'High-throughput, distributed partitioned streaming event broker with SASL/SCRAM and Schema Registry integration.',
    protocol: 'Kafka Wire Protocol 3.6 / mTLS',
    defaultThroughput: '35,000 msg/s',
    authMethod: 'SASL/SCRAM-SHA-512 + Mutual TLS',
    recommendedSources: ['source', 'transform'],
    recommendedTargets: ['transform', 'sink', 'guardrail']
  },
  {
    id: 'conn-snowflake',
    name: 'Snowflake Data Cloud',
    category: 'Warehouse & Lakehouse',
    type: 'snowflake',
    description: 'Cloud data warehouse synchronizer with Snowpipe Streaming API and Iceberg external table catalog reflection.',
    protocol: 'Snowpipe Streaming SDK / HTTPS',
    defaultThroughput: '24,000 rec/s',
    authMethod: 'Key-Pair JWT Authentication (RSA 2048)',
    recommendedSources: ['transform', 'guardrail'],
    recommendedTargets: ['sink']
  },
  {
    id: 'conn-s3-iceberg',
    name: 'AWS S3 / Apache Iceberg Object Store',
    category: 'Warehouse & Lakehouse',
    type: 's3',
    description: 'Scalable immutable parquet lakehouse storage with AWS SigV4 IAM authentication and S3 ObjectLock.',
    protocol: 'Amazon S3 REST API / SigV4',
    defaultThroughput: '38.4 MB/s',
    authMethod: 'AWS IAM Role ARN Assumed Identity',
    recommendedSources: ['source', 'transform'],
    recommendedTargets: ['sink', 'transform']
  },
  {
    id: 'conn-postgres-cdc',
    name: 'PostgreSQL Debezium CDC',
    category: 'Databases & CDC',
    type: 'postgres',
    description: 'Zero-downtime transactional change data capture ingesting WAL write-ahead logs with strict order guarantees.',
    protocol: 'PostgreSQL Replication Protocol / mTLS',
    defaultThroughput: '22,000 rec/s',
    authMethod: 'Enterprise Vault Dynamic Role Secret',
    recommendedSources: ['source'],
    recommendedTargets: ['transform', 'guardrail']
  },
  {
    id: 'conn-databricks',
    name: 'Databricks Delta Sharing Engine',
    category: 'Warehouse & Lakehouse',
    type: 'databricks',
    description: 'Open data sharing protocol for multi-region Delta Lake ACID transactions with Parquet partition indexing.',
    protocol: 'Delta Sharing REST Protocol v1',
    defaultThroughput: '28,000 rec/s',
    authMethod: 'Bearer Token with Profile Credentials',
    recommendedSources: ['transform'],
    recommendedTargets: ['sink', 'transform']
  },
  {
    id: 'conn-gemini',
    name: 'Google Gemini Pro / Guardrail Proxy',
    category: 'AI & Guardrails',
    type: 'gemini',
    description: 'Generative AI safety, semantic evaluation, prompt injection screening, and multi-modal vector embeddings.',
    protocol: 'Google GenAI SDK Proxy / gRPC',
    defaultThroughput: '32,000 tokens/s',
    authMethod: 'GCP Service Account / OIDC Bearer Token',
    recommendedSources: ['source', 'transform'],
    recommendedTargets: ['guardrail', 'transform', 'sink']
  },
  {
    id: 'conn-salesforce',
    name: 'Salesforce Enterprise CRM & PubSub',
    category: 'SaaS & Enterprise APIs',
    type: 'salesforce',
    description: 'Bidirectional Salesforce CRM event synchronizer using Pub/Sub gRPC API and Change Data Capture objects.',
    protocol: 'Salesforce Pub/Sub gRPC API',
    defaultThroughput: '12,500 rec/s',
    authMethod: 'OAuth 2.0 JWT Bearer Flow',
    recommendedSources: ['source', 'transform'],
    recommendedTargets: ['sink', 'transform']
  },
  {
    id: 'conn-rest-webhook',
    name: 'Secure REST Webhook Gateway',
    category: 'SaaS & Enterprise APIs',
    type: 'rest',
    description: 'Standard HTTP/2 REST webhook with HMAC-SHA256 signature verification, exponential backoff, and DLQ retries.',
    protocol: 'HTTPS REST Webhook / HTTP/2',
    defaultThroughput: '18,000 req/s',
    authMethod: 'HMAC-SHA256 Shared Secret Header',
    recommendedSources: ['source', 'transform'],
    recommendedTargets: ['sink', 'guardrail']
  },
  {
    id: 'conn-powerbi',
    name: 'Power BI DirectLake Report Sink',
    category: 'Warehouse & Lakehouse',
    type: 'snowflake',
    description: 'DirectLake semantic model push, streaming dataset ingestion, and automated Power BI report workspace refresh.',
    protocol: 'Power BI REST API / DirectLake XMLA',
    defaultThroughput: '18,500 rows/s streaming push',
    authMethod: 'Microsoft Entra ID / OAuth 2.0 Bearer Token',
    recommendedSources: ['source', 'transform', 'guardrail'],
    recommendedTargets: ['sink']
  },
  {
    id: 'conn-grpc-mesh',
    name: 'Envoy Service Mesh gRPC Pipe',
    category: 'Streaming & Event',
    type: 'grpc',
    description: 'Ultra-low latency Protobuf serialization across microservices with mutual TLS 1.3 hardware acceleration.',
    protocol: 'gRPC Protobuf Zero-Copy Pipe',
    defaultThroughput: '50,000 msg/s',
    authMethod: 'SPIFFE / SPIRE mTLS X.509 Identity',
    recommendedSources: ['source', 'transform', 'guardrail'],
    recommendedTargets: ['transform', 'guardrail', 'sink']
  }
];
