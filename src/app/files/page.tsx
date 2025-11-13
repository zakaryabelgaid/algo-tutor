
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { grades, fileCategories } from '@/lib/data';
import { Download, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from '@/context/language-context';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useContext } from 'react';
import { UserContext } from '@/context/user-context';

export default function FilesPage() {
  const { t } = useTranslation();
  const { uploads } = useContext(UserContext);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">{t('filesPage.title')}</h1>
      
      <Card>
        <Accordion type="multiple" className="w-full">
          {grades.map(grade => (
            <AccordionItem value={grade.id} key={grade.id} className="border-b">
                <AccordionTrigger className="text-2xl font-bold hover:no-underline p-6">
                  {t(`grades.${grade.id}`)}
                </AccordionTrigger>
              <AccordionContent>
                <div className="px-6 pb-6">
                  <Accordion type="multiple" className="w-full space-y-4">
                    {[1, 2].map(semester => (
                       <AccordionItem value={`${grade.id}-s${semester}`} key={semester} className="border-none">
                          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-0">
                            {t('admin.fileManagement.semester')} {semester}
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                              <Accordion type="multiple" className="w-full space-y-2">
                                {fileCategories.map(category => {
                                  const files = uploads.filter(
                                    file => file.gradeId === grade.id && file.semester === semester && file.categoryId === category.id
                                  );
                                  if (files.length === 0) return null;
                                  return (
                                      <AccordionItem value={`${grade.id}-s${semester}-${category.id}`} key={category.id} className="border rounded-lg">
                                         <AccordionTrigger className="font-medium hover:no-underline px-4 py-3">
                                            <div>
                                                <p>{t(`fileCategories.${category.id}.name`)}</p>
                                                <p className="text-sm text-muted-foreground font-normal">{t(`fileCategories.${category.id}.description`)}</p>
                                            </div>
                                         </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <ul className="space-y-2 pt-4 border-t">
                                              {files.map(file => (
                                                <li key={file.id} className="flex items-center justify-between p-2 border rounded-md">
                                                  <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                    <span className="font-medium">{file.fileName}</span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <Button asChild variant="outline" size="sm">
                                                      <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                      </a>
                                                    </Button>
                                                    <Button asChild variant="outline" size="sm">
                                                      <a href={file.fileUrl} download={file.fileName}>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        {t('filesPage.download')}
                                                      </a>
                                                    </Button>
                                                  </div>
                                                </li>
                                              ))}
                                            </ul>
                                        </AccordionContent>
                                      </AccordionItem>
                                  );
                                })}
                              </Accordion>
                          </AccordionContent>
                       </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}
