import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import swaggerAutogen from 'swagger-autogen';

const _dirname = dirname(fileURLToPath(import.meta.url))

const doc = {
  info: {
      version: "0.1.0",
      title: "REST API logger",
      description: "Сервис logger для сбора и хранения логов"
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: [
      "http"
    ],
    securityDefinitions: {
      getLogByDate: {
        type: 'object',
        properties: {
          dateTo: {
            type: 'string',
            example: '2022-01-01'
          },
          dateFrom: {
            type: 'string',
            example: '2022-01-01'
          },
          server: {
            type: 'string',
            example: 'fimg'
          }
        }
      },
      error: {
        type: 'object',
        properties: {
          error: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: '242.X.Y - Ошибка'
          },
          DATA: {
            type: 'object',
            properties: {}
          },
          warning: {
            type: 'string',
            example: 'Предупреждение'
          } 
        }
      },
      hash: {
        type: 'object',
        properties: {
          hash: {
            type: 'string',
            example: '579fc77962ca697b8fdefb42178f0472e981522ff3fb1c2a2cd9f84f70d8fb1f'
          } 
        }
      },
      getServicesResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: ''
          },
          DATA: {
            type: 'object',
            properties: {
              result: {
                type: 'object',
                example: ['dealers','fimg-local']
              },
            }
          },
          warning: {
            type: 'string',
            example: 'Предупреждение'
          } 
        }
      },
      successLog: {
        type: 'object',
        properties: {
          error: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: ''
          },
          DATA: {
            type: 'object',
            properties: {
                pid: {
                    type: 'number',
                    example: 12343
                },
                hash: {
                    type: 'string',
                    example: '579fc77962ca697b8fdefb42178f0472e981522ff3fb1c2a2cd9f84f70d8fb1f'
                },
                server: {
                  type: 'string',
                  example: 'fimg-local'
                },
                request: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            example: 1
                        },
                        method: {
                            type: 'string',
                            example: 'POST'
                        },
                        path: {
                            type: 'string',
                            example: '/delete'
                        },
                        requestTime: {
                            type: 'string',
                            example: '3245435245234',
                        },
                        headers: {
                            type: 'object',
                            properties: {
                                Host: {
                                    type: 'string',
                                    example: 'http://192.168.250.8'
                                },
                                ContentType: {
                                    type: 'string',
                                    example: 'application-json'
                                }
                            }
                        },
                        body: {
                            type: 'object',
                            properties: {
                                param1: {
                                    type: 'string',
                                    example: 'param1'
                                },
                                paramN: {
                                    type: 'string',
                                    example: 'paramN'
                                }
                            }
                        }
                    }
                },
                response: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number',
                            example: 200
                        },
                        body: {
                            type: 'object',
                            properties: {
                                param1: {
                                    type: 'string',
                                    example: 'param1'
                                },
                                paramN: {
                                    type: 'string',
                                    example: 'paramN'
                                }
                            }
                        },
                        responseTime: {
                            type: 'string',
                            example: '324543524578',
                        }
                    }
                },
                time: {
                    type: 'string',
                    example: '124'
                },
                steps: {
                    type: 'string',
                    example: 'Массив шагов выполнения алгоритма на сервере'
                }
            }
          },
          warning: {
            type: 'string',
            example: 'Предупреждение'
          } 
        }
      },
      getStatisticErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: ''
          },
          DATA: {
            type: 'object',
            properties: {
              result: {
                type: 'object',
                example: [
                  {
                    server : "fimg",
                    errors : [
                      {
                        error : "60.3.3 - Запись не найдена",
                        count: 35,
                        percent: 83.33
                      },
                      {
                        error: "60.1.3 - Данных не обнаружено",
                        count: 7,
                        percent: 16.66
                      }
                    ],
                    countErr: 42
                  }
                ]
              },
            }
          },
          warning: {
            type: 'string',
            example: 'Предупреждение'
          } 
        }
      }
    }
}

const options = {
    autoQuery: false,
    autoBody: false
}

// путь и название генерируемого файла
const outputFile = join(_dirname, 'documentation.json');
// массив путей к роутерам
const endpointsFiles = [join(_dirname, '../server.ts')];
swaggerAutogen(options)(outputFile, endpointsFiles, doc).then(({ success }) => {
  console.log(`Generated: ${success}`)
})